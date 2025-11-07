// Service para logging de requisições e respostas da API

interface LogEntry {
    timestamp: string;
    type: 'API_CALL' | 'API_RESPONSE' | 'ERROR' | 'INFO';
    endpoint?: string;
    method?: string;
    status?: number;
    data?: any;
    error?: any;
    message?: string;
}

class LogService {
    private logs: LogEntry[] = [];
    private readonly MAX_LOGS = 100; // Limitar número de logs em memória

    log(entry: Omit<LogEntry, 'timestamp'>) {
        const logEntry: LogEntry = {
            ...entry,
            timestamp: new Date().toISOString()
        };

        this.logs.push(logEntry);

        // Manter apenas os últimos MAX_LOGS
        if (this.logs.length > this.MAX_LOGS) {
            this.logs.shift();
        }

        // Log no console também
        console.log(`[${logEntry.timestamp}] [${logEntry.type}]`, logEntry);

        // Salvar no localStorage
        this.saveToLocalStorage();
    }

    logApiCall(method: string, endpoint: string, body?: any) {
        this.log({
            type: 'API_CALL',
            method,
            endpoint,
            data: body,
            message: `${method} ${endpoint}`
        });
    }

    logApiResponse(endpoint: string, status: number, data?: any) {
        this.log({
            type: 'API_RESPONSE',
            endpoint,
            status,
            data,
            message: `Response from ${endpoint}: ${status}`
        });
    }

    logError(message: string, error?: any) {
        this.log({
            type: 'ERROR',
            message,
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : error
        });
    }

    logInfo(message: string, data?: any) {
        this.log({
            type: 'INFO',
            message,
            data
        });
    }

    private saveToLocalStorage() {
        try {
            localStorage.setItem('revisapp_logs', JSON.stringify(this.logs));
        } catch (e) {
            console.error('Failed to save logs to localStorage', e);
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('revisapp_logs');
            if (stored) {
                this.logs = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load logs from localStorage', e);
        }
    }

    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    getLogsAsText(): string {
        return this.logs.map(log => {
            let text = `[${log.timestamp}] [${log.type}] ${log.message || ''}`;
            
            if (log.endpoint) text += `\n  Endpoint: ${log.endpoint}`;
            if (log.method) text += `\n  Method: ${log.method}`;
            if (log.status) text += `\n  Status: ${log.status}`;
            if (log.data) text += `\n  Data: ${JSON.stringify(log.data, null, 2)}`;
            if (log.error) text += `\n  Error: ${JSON.stringify(log.error, null, 2)}`;
            
            return text;
        }).join('\n\n---\n\n');
    }

    downloadLogs() {
        const text = this.getLogsAsText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revisapp-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearLogs() {
        this.logs = [];
        localStorage.removeItem('revisapp_logs');
        console.log('Logs cleared');
    }

    getRecentErrors(count: number = 10): LogEntry[] {
        return this.logs
            .filter(log => log.type === 'ERROR')
            .slice(-count);
    }
}

// Singleton instance
export const logger = new LogService();

// Carregar logs existentes ao iniciar
logger.loadFromLocalStorage();

// Expor globalmente para debug no console
if (typeof window !== 'undefined') {
    (window as any).revisappLogger = {
        getLogs: () => logger.getLogs(),
        getLogsAsText: () => logger.getLogsAsText(),
        downloadLogs: () => logger.downloadLogs(),
        clearLogs: () => logger.clearLogs(),
        getRecentErrors: () => logger.getRecentErrors()
    };
}
