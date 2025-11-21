import { useState, useEffect } from 'react';
import Button from './components/Button';
import Icon from './components/Icon';

interface ScanResult {
	name: string;
	count: number;
	resolvedType?: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
	layers: { name: string; id: string; visible: boolean }[];
}

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

	const filteredResults = results.filter(result => {
		if (!result.resolvedType) return true; // Show if type is unknown, or handle as needed
		return activeFilters.has(result.resolvedType);
	});

	const styles = {
		container: {
			display: 'flex',
			flexDirection: 'column' as const,
			height: '100%',
			padding: '16px',
			gap: '16px',
			color: 'var(--figma-color-text)',
		},
		header: {
			display: 'flex',
			flexDirection: 'column' as const,
			gap: '12px',
		},
		topBar: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: '8px',
		},
		title: {
			fontSize: '14px',
			fontWeight: 600,
			marginRight: 'auto',
		},
		buttonGroup: {
			display: 'flex',
			gap: '8px',
		},
		filterBar: {
			display: 'flex',
			gap: '8px',
			padding: '4px 0',
		},
		filterButton: (isActive: boolean) => ({
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '24px',
			height: '24px',
			borderRadius: '4px',
			border: '1px solid var(--figma-color-border)',
			backgroundColor: isActive ? 'var(--figma-color-bg-brand)' : 'transparent',
			color: isActive ? 'var(--figma-color-text-onbrand)' : 'var(--figma-color-text)',
			cursor: 'pointer',
			transition: 'all 0.2s ease',
			':hover': {
				backgroundColor: isActive ? 'var(--figma-color-bg-brand-hover)' : 'var(--figma-color-bg-hover)',
			}
		}),
		tableContainer: {
			flex: 1,
			overflow: 'auto',
			border: '1px solid var(--figma-color-border)',
			borderRadius: '4px',
		},
		table: {
			width: '100%',
			borderCollapse: 'collapse' as const,
			fontSize: '11px',
		},
		th: {
			textAlign: 'left' as const,
			padding: '6px',
			borderBottom: '1px solid var(--figma-color-border)',
			backgroundColor: 'var(--figma-color-bg-secondary)',
			position: 'sticky' as const,
			top: 0,
		},
		td: {
			padding: '6px',
			borderLeft: '1px solid var(--figma-color-border)',
			borderBottom: '1px solid var(--figma-color-border)',
		},
		layerLink: {
			color: 'var(--figma-color-text-brand)',
			cursor: 'pointer',
			textDecoration: 'underline',
			background: 'none',
			border: 'none',
			padding: 0,
			fontSize: 'inherit',
		},
		emptyState: {
			display: 'flex',
			flexDirection: 'column' as const,
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
			color: 'var(--figma-color-text-secondary)',
			gap: '8px',
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<div style={styles.topBar}>
					<div style={styles.title}>Variable Scanner</div>
					<div style={styles.buttonGroup}>
						<Button onClick={() => handleScan('file')} style={{ border: '1px solid var(--figma-color-border)' }}>
							Scan File
						</Button>
						<Button onClick={() => handleScan('page')} style={{ backgroundColor: 'var(--figma-color-bg-brand)', color: 'var(--figma-color-text-onbrand)', border: 'none' }}>
							{isScanning ? 'Scanning...' : 'Scan Page'}
						</Button>
					</div>
				</div>
				<div style={styles.filterBar}>
					<button
						style={styles.filterButton(activeFilters.has('COLOR'))}
						onClick={() => toggleFilter('COLOR')}
						title="Filter Colors"
					>
						<Icon svg="color" size={20} />
					</button>
					<button
						style={styles.filterButton(activeFilters.has('FLOAT'))}
						onClick={() => toggleFilter('FLOAT')}
						title="Filter Numbers"
					>
						<Icon svg="number" size={20} />
					</button>
					<button
						style={styles.filterButton(activeFilters.has('STRING'))}
						onClick={() => toggleFilter('STRING')}
						title="Filter Strings"
					>
						<Icon svg="string" size={20} />
					</button>
					<button
						style={styles.filterButton(activeFilters.has('BOOLEAN'))}
						onClick={() => toggleFilter('BOOLEAN')}
						title="Filter Booleans"
					>
						<Icon svg="boolean" size={20} />
					</button>
				</div>
			</div>

			<div style={styles.tableContainer}>
				{filteredResults.length > 0 ? (
					<table style={styles.table}>
						<thead>
							<tr>
								<th style={styles.th}>Count - Variable Name</th>
								<th style={styles.th}>Layers</th>
							</tr>
						</thead>
						<tbody>
							{filteredResults.map((result, resultIndex) => (
								result.layers.map((layer, layerIndex) => (
									<tr key={`${resultIndex}-${layerIndex}`}>
										{layerIndex === 0 && (
											<>
												<td style={{ ...styles.td, verticalAlign: 'top' }} rowSpan={result.layers.length}>
													{result.count} - {result.name}
												</td>
											</>
										)}
										<td style={styles.td}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
												<Icon svg={layer.visible ? 'visible' : 'hidden'} size={12} />
												<button style={styles.layerLink} onClick={() => handleLayerClick(layer.id)}>
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
					<div style={styles.emptyState}>
						<Icon svg="plugma" size={32} />
						<div>{isScanning ? 'Scanning for variables...' : (results.length > 0 ? 'No results match filters.' : 'No variables found or scan not started.')}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
