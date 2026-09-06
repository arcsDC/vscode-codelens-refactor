import * as vscode from 'vscode';
import { configManager } from './config';

class CallCounter {
    private cache = new Map<string, number>();
    private debounceTimers = new Map<string, NodeJS.Timeout>();

    clearCache(): void {
        this.cache.clear();
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
    }

    async getCount(document: vscode.TextDocument, symbolName: string, token: vscode.CancellationToken): Promise<number> {
        const key = `${document.uri.toString()}:${symbolName}:${document.version}`;
        
        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const debounceMs = configManager.getDebounceMs();
        const existingTimer = this.debounceTimers.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        return new Promise<number>((resolve) => {
            const timer = setTimeout(async () => {
                this.debounceTimers.delete(key);
                try {
                    const escapedName = symbolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const searchPattern = new RegExp(`\\b${escapedName}\\s*\\(`);
                    const results = await vscode.workspace.findTextInFiles({
                        pattern: searchPattern,
                        isRegExp: true
                    }, {
                        exclude: undefined,
                        maxResults: 1000
                    }, token);

                    const count = results.reduce((sum, fileResults) => sum + fileResults.length, 0);
                    this.cache.set(key, count);
                    resolve(count);
                } catch (error) {
                    this.cache.set(key, 0);
                    resolve(0);
                }
            }, debounceMs);
            this.debounceTimers.set(key, timer);
        });
    }
}

export const callCounter = new CallCounter();
