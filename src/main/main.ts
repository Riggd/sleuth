export default function () {
	figma.showUI(__html__, { width: 400, height: 500, themeColors: true });

	// Cache for variable details to avoid repeated API calls
	const variableCache = new Map<string, { name: string; id: string; resolvedType?: VariableResolvedDataType }>();

	const scanNodes = async (scope: PageNode | DocumentNode) => {
		// Helper to check if a node and all its parents are visible
		const isNodeVisible = (node: SceneNode): boolean => {
			let current: BaseNode | null = node;
			while (current && 'visible' in current) {
				if (!(current as { visible: boolean }).visible) {
					return false;
				}
				current = current.parent;
			}
			return true;
		};

		const variableUsage = new Map<string, { name: string; resolvedType?: VariableResolvedDataType; count: number; layers: { name: string; id: string; visible: boolean }[] }>();

		// Phase 1: Collect nodes
		let nodes: SceneNode[] = [];

		try {
			const processContainer = async (container: PageNode | SceneNode) => {
				// If it's a page, we iterate top-level children to chunk the work
				if (container.type === 'PAGE') {
					for (const child of container.children) {
						// Check the child itself
						if ('boundVariables' in child && child.boundVariables !== undefined) {
							nodes.push(child as SceneNode);
						}
						// Check descendants using findAll for speed, but scoped to this child
						if ('findAll' in child) {
							const childNodes = (child as any).findAll((node: any) => {
								return 'boundVariables' in node && node.boundVariables !== undefined;
							});
							nodes = nodes.concat(childNodes as SceneNode[]);
						}
						// Yield after each top-level layer to keep UI responsive
						await new Promise(resolve => setTimeout(resolve, 0));
					}
				} else {
					// Fallback for non-page scopes (though we mainly pass pages or document)
					const found = (container as any).findAll((node: any) => {
						return 'boundVariables' in node && node.boundVariables !== undefined;
					});
					nodes = nodes.concat(found as SceneNode[]);
				}
			};

			if (scope.type === 'DOCUMENT') {
				for (const page of scope.children) {
					await page.loadAsync();
					await processContainer(page);
				}
			} else {
				await processContainer(scope as PageNode);
			}
		} catch (e) {
			console.error("Error collecting nodes:", e);
			return [];
		}

		// Helper to find all variable aliases in a boundVariables object
		const findAliases = (obj: any): string[] => {
			const ids: string[] = [];
			if (!obj) return ids;

			if (typeof obj === 'object') {
				if (obj.type === 'VARIABLE_ALIAS' && obj.id) {
					ids.push(obj.id);
				} else {
					for (const key in obj) {
						ids.push(...findAliases(obj[key]));
					}
				}
			} else if (Array.isArray(obj)) {
				for (const item of obj) {
					ids.push(...findAliases(item));
				}
			}
			return ids;
		};

		// Phase 2: Collect Variable IDs and map to nodes
		// We map VariableID -> List of Nodes that use it
		const varIdToNodes = new Map<string, SceneNode[]>();

		// Process nodes in chunks to avoid freezing UI
		const CHUNK_SIZE = 100;
		for (let i = 0; i < nodes.length; i++) {
			if (i % CHUNK_SIZE === 0) {
				await new Promise(resolve => setTimeout(resolve, 0));
			}

			const node = nodes[i];
			const boundVariables = (node as any).boundVariables;
			if (!boundVariables) continue;

			const aliases = findAliases(boundVariables);
			for (const id of aliases) {
				if (!varIdToNodes.has(id)) {
					varIdToNodes.set(id, []);
				}
				varIdToNodes.get(id)!.push(node);
			}
		}

		// Phase 3: Resolve Variables (Fetch missing from cache)
		const uniqueIds = Array.from(varIdToNodes.keys());
		const missingIds = uniqueIds.filter(id => !variableCache.has(id));

		// Fetch in batches
		const FETCH_BATCH_SIZE = 50;
		for (let i = 0; i < missingIds.length; i += FETCH_BATCH_SIZE) {
			const batch = missingIds.slice(i, i + FETCH_BATCH_SIZE);
			await Promise.all(batch.map(async (id) => {
				try {
					const variable = await figma.variables.getVariableByIdAsync(id);
					if (variable) {
						variableCache.set(id, { name: variable.name, id: variable.id, resolvedType: variable.resolvedType });
					}
				} catch (e) {
					console.error("Error fetching variable", id, e);
				}
			}));
			// Yield after each batch
			await new Promise(resolve => setTimeout(resolve, 0));
		}

		// Phase 4: Assemble Results
		for (const id of uniqueIds) {
			const info = variableCache.get(id);
			if (!info) continue; // Skip if failed to fetch or not found

			const nodesUsingVar = varIdToNodes.get(id)!;

			// We want to aggregate by variable, but also list layers
			// The previous structure was: Map<VarID, {name, count, layers}>

			if (!variableUsage.has(id)) {
				variableUsage.set(id, {
					name: info.name,
					// @ts-ignore
					resolvedType: info.resolvedType,
					count: 0,
					layers: []
				});
			}

			const entry = variableUsage.get(id)!;

			for (const node of nodesUsingVar) {
				// Avoid duplicates if a node uses the same variable multiple times (e.g. fill and stroke)
				const isAlreadyListed = entry.layers.some(l => l.id === node.id);
				if (!isAlreadyListed) {
					const layerName = node.name || "Jump to Element";
					entry.layers.push({ name: layerName, id: node.id, visible: isNodeVisible(node) });
					entry.count++;
				}
			}
		}

		return Array.from(variableUsage.values());
	};

	figma.ui.onmessage = async (msg) => {
		try {
			if (msg.type === 'scan-variables') {
				const results = await scanNodes(figma.currentPage);
				figma.ui.postMessage({ type: 'scan-result', results });
			}

			if (msg.type === 'scan-file-variables') {
				const results = await scanNodes(figma.root);
				figma.ui.postMessage({ type: 'scan-result', results });
			}

			if (msg.type === 'focus-layer') {
				const layerId = msg.id;
				if (layerId) {
					const node = await figma.getNodeByIdAsync(layerId);
					if (node) {
						// Find the page containing the node
						let currentNode = node;
						while (currentNode.parent && currentNode.parent.type !== 'DOCUMENT') {
							currentNode = currentNode.parent as any;
						}

						if (currentNode.type === 'PAGE' && currentNode !== figma.currentPage) {
							await figma.setCurrentPageAsync(currentNode as PageNode);
						}

						figma.currentPage.selection = [node as SceneNode];
						figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
					}
				}
			}
		} catch (e: any) {
			console.error("Plugin error:", e);
			figma.ui.postMessage({ type: 'scan-error', error: e.toString() });
		}
	};
}
