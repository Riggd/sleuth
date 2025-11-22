import { useState, useEffect } from 'react';
import Button from './components/Button';
import Icon from './components/Icon';

interface ScanResult {
	name: string;
	count: number;
	resolvedType?: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
	layers: { name: string; id: string; visible: boolean }[];
}

const FILTER_CONFIGS = [
	{ type: 'COLOR', icon: 'color', title: 'Filter Colors' },
	{ type: 'FLOAT', icon: 'number', title: 'Filter Numbers' },
	{ type: 'STRING', icon: 'string', title: 'Filter Strings' },
	{ type: 'BOOLEAN', icon: 'boolean', title: 'Filter Booleans' },
] as const;

const App = () => {
	const [results, setResults] = useState<ScanResult[]>([]);
	const [isScanning, setIsScanning] = useState(false);
	const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['COLOR', 'FLOAT', 'STRING', 'BOOLEAN']));

	useEffect(() => {
		window.onmessage = (event) => {
			const { type, results, error } = event.data.pluginMessage;
			if (type === 'scan-result') {
				setResults(results);
				setIsScanning(false);
			} else if (type === 'scan-error') {
				console.error('Scan error:', error);
				setIsScanning(false);
				// Optionally show error to user, for now just log
				alert('Error scanning file: ' + error);
			}
		};
	}, []);

	const handleScan = (scope: 'page' | 'file') => {
		setIsScanning(true);
		if (scope === 'page') {
			parent.postMessage({ pluginMessage: { type: 'scan-variables' } }, '*');
		} else {
			parent.postMessage({ pluginMessage: { type: 'scan-file-variables' } }, '*');
		}
	};

	const handleLayerClick = (id: string) => {
		parent.postMessage({ pluginMessage: { type: 'focus-layer', id } }, '*');
	};

	const toggleFilter = (type: string) => {
		const newFilters = new Set(activeFilters);
		if (newFilters.has(type)) {
			newFilters.delete(type);
		} else {
			newFilters.add(type);
		}
		setActiveFilters(newFilters);
	};

	const handleReset = () => {
		setResults([]);
		setActiveFilters(new Set(['COLOR', 'FLOAT', 'STRING', 'BOOLEAN']));
	};

	const filteredResults = results.filter(result => {
		if (!result.resolvedType) return true; // Show if type is unknown, or handle as needed
		return activeFilters.has(result.resolvedType);
	});

	return (
		<div className="app-container">
			<div className="app-header">
				<div className="top-bar">
					{results.length === 0 ? (
						<>
							<div className="app-title">Variable Scanner</div>
							<div className="button-group">
								<Button onClick={() => handleScan('file')} className="btn-secondary">
									Scan File
								</Button>
								<Button onClick={() => handleScan('page')} className="btn-primary">
									{isScanning ? 'Scanning...' : 'Scan Page'}
								</Button>
							</div>
						</>
					) : (
						<>
							<div className="title-container">
								<div className="app-title">Variable Scanner</div>
								<button
									className="filter-button reset-button"
									onClick={handleReset}
									title="Reset plugin"
								>
									<Icon svg="reset" size={20} />
								</button>
							</div>
							<div className="filter-bar">
								{FILTER_CONFIGS.map(({ type, icon, title }) => (
									<button
										key={type}
										className={`filter-button ${activeFilters.has(type) ? 'active' : ''}`}
										onClick={() => toggleFilter(type)}
										title={title}
									>
										<Icon svg={icon} size={20} />
									</button>
								))}
							</div>
						</>
					)}
				</div>
			</div>

			<div className="table-container">
				{filteredResults.length > 0 ? (
					<table className="data-table">
						<thead>
							<tr>
								<th className="table-header">Count - Variable Name</th>
								<th className="table-header">Layers</th>
							</tr>
						</thead>
						<tbody>
							{filteredResults.map((result, resultIndex) => (
								result.layers.map((layer, layerIndex) => (
									<tr key={`${resultIndex}-${layerIndex}`}>
										{layerIndex === 0 && (
											<>
												<td className="table-cell table-cell-top" rowSpan={result.layers.length}>
													<div className="sticky-variable-name">
														{result.count} - {result.name}
													</div>
												</td>
											</>
										)}
										<td className="table-cell">
											<div className="layer-row">
												<div>
													<Icon svg={layer.visible ? 'visible' : 'hidden'} size={12} />
												</div>
												<button className="layer-link" onClick={() => handleLayerClick(layer.id)}>
													{layer.name}
												</button>
											</div>
										</td>
									</tr>
								))
							))}
						</tbody>
					</table>
				) : (
					<div className="empty-state">
						<Icon svg="plugma" size={32} />
						<div>{isScanning ? 'Scanning for variables...' : (results.length > 0 ? 'No results match filters.' : 'No variables found or scan not started.')}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
