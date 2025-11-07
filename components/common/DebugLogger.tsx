import React, { useState, useEffect } from 'react';
import { logger } from '../../services/logService';

export const DebugLogger: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState(logger.getLogs());
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            setLogs(logger.getLogs());
        }, 1000);

        return () => clearInterval(interval);
    }, [autoRefresh]);

    const handleDownload = () => {
        logger.downloadLogs();
    };

    const handleClear = () => {
        if (confirm('Tem certeza que deseja limpar todos os logs?')) {
            logger.clearLogs();
            setLogs([]);
        }
    };

    const handleRefresh = () => {
        setLogs(logger.getLogs());
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 9998,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
            >
                📋 Debug Logs
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '600px',
            maxHeight: '80vh',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
            }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>📋 Debug Logs ({logs.length})</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '0 5px'
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Controls */}
            <div style={{
                padding: '10px 15px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
            }}>
                <button onClick={handleRefresh} style={buttonStyle}>
                    🔄 Atualizar
                </button>
                <button onClick={handleDownload} style={buttonStyle}>
                    💾 Baixar
                </button>
                <button onClick={handleClear} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>
                    🗑️ Limpar
                </button>
                <label style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                    <input
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        style={{ marginRight: '5px' }}
                    />
                    Auto-atualizar
                </label>
            </div>

            {/* Logs */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '15px',
                fontFamily: 'monospace',
                fontSize: '12px'
            }}>
                {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                        Nenhum log disponível
                    </div>
                ) : (
                    logs.slice().reverse().map((log, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: getLogColor(log.type),
                                borderLeft: `4px solid ${getLogBorderColor(log.type)}`,
                                borderRadius: '4px'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                <span style={{ color: getLogBorderColor(log.type) }}>
                                    {getLogIcon(log.type)}
                                </span>
                                {' '}
                                {log.type}
                                {' - '}
                                <span style={{ fontSize: '11px', color: '#666' }}>
                                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                                </span>
                            </div>
                            {log.message && (
                                <div style={{ marginBottom: '5px' }}>{log.message}</div>
                            )}
                            {log.endpoint && (
                                <div style={{ fontSize: '11px', color: '#555' }}>
                                    {log.method && `${log.method} `}{log.endpoint}
                                </div>
                            )}
                            {log.status && (
                                <div style={{ fontSize: '11px', color: '#555' }}>
                                    Status: {log.status}
                                </div>
                            )}
                            {log.data && (
                                <details style={{ marginTop: '5px' }}>
                                    <summary style={{ cursor: 'pointer', color: '#007bff' }}>
                                        Ver dados
                                    </summary>
                                    <pre style={{
                                        marginTop: '5px',
                                        padding: '5px',
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                        borderRadius: '3px',
                                        overflow: 'auto'
                                    }}>
                                        {JSON.stringify(log.data, null, 2)}
                                    </pre>
                                </details>
                            )}
                            {log.error && (
                                <details style={{ marginTop: '5px' }}>
                                    <summary style={{ cursor: 'pointer', color: '#dc3545' }}>
                                        Ver erro
                                    </summary>
                                    <pre style={{
                                        marginTop: '5px',
                                        padding: '5px',
                                        backgroundColor: 'rgba(220,53,69,0.1)',
                                        borderRadius: '3px',
                                        overflow: 'auto',
                                        color: '#dc3545'
                                    }}>
                                        {JSON.stringify(log.error, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const buttonStyle: React.CSSProperties = {
    padding: '5px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
};

function getLogColor(type: string): string {
    switch (type) {
        case 'ERROR': return '#fff5f5';
        case 'API_CALL': return '#f0f8ff';
        case 'API_RESPONSE': return '#f0fff4';
        case 'INFO': return '#fffef0';
        default: return '#f9f9f9';
    }
}

function getLogBorderColor(type: string): string {
    switch (type) {
        case 'ERROR': return '#dc3545';
        case 'API_CALL': return '#007bff';
        case 'API_RESPONSE': return '#28a745';
        case 'INFO': return '#ffc107';
        default: return '#6c757d';
    }
}

function getLogIcon(type: string): string {
    switch (type) {
        case 'ERROR': return '❌';
        case 'API_CALL': return '📤';
        case 'API_RESPONSE': return '📥';
        case 'INFO': return 'ℹ️';
        default: return '📝';
    }
}
