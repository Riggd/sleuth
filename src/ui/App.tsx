import { useState, useEffect } from 'react';
import Button from './components/Button';
import Icon from './components/Icon';

interface ScanResult {
	name: string;
	count: number;
	layers: { name: string; id: string }[];
}

const App = () => {
	const [results, setResults] = useState<ScanResult[]>([]);
	const [isScanning, setIsScanning] = useState(false);

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
			padding: '8px',
			borderBottom: '1px solid var(--figma-color-border)',
			backgroundColor: 'var(--figma-color-bg-secondary)',
			position: 'sticky' as const,
			top: 0,
		},
		td: {
			padding: '8px',
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
				<div style={styles.title}>Variable Scanner</div>
				<div style={styles.buttonGroup}>
					<Button onClick={() => handleScan('page')} style={{ backgroundColor: 'var(--figma-color-bg-brand)', color: 'var(--figma-color-text-onbrand)', border: 'none' }}>
						{isScanning ? 'Scanning...' : 'Scan Page'}
					</Button>
					<Button onClick={() => handleScan('file')} style={{ border: '1px solid var(--figma-color-border)' }}>
						Scan File
					</Button>
				</div>
			</div>

			<div style={styles.tableContainer}>
				{results.length > 0 ? (
					<table style={styles.table}>
						<thead>
							<tr>
								<th style={styles.th}>Variable Name</th>
								<th style={styles.th}>Count</th>
								<th style={styles.th}>Layers</th>
							</tr>
						</thead>
						<tbody>
							{results.map((result, index) => (
								<tr key={index}>
									<td style={styles.td}>{result.name}</td>
									<td style={styles.td}>{result.count}</td>
									<td style={styles.td}>
										{result.layers.map((layer, i) => (
											<span key={i}>
												<button style={styles.layerLink} onClick={() => handleLayerClick(layer.id)}>
													{layer.name}
												</button>
												{i < result.layers.length - 1 ? ', ' : ''}
											</span>
										))}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div style={styles.emptyState}>
						<Icon svg="plugma" size={32} />
						<div>{isScanning ? 'Scanning for variables...' : 'No variables found or scan not started.'}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
