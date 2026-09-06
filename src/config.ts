import * as vscode from 'vscode';

class ConfigManager {
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration('codelensRefactor');
    }

    refresh(): void {
        this.config = vscode.workspace.getConfiguration('codelensRefactor');
    }

    isEnabled(languageId: string): boolean {
        if (!this.config.get<boolean>('enabled', true)) {
            return false;
        }
        const languages = this.config.get<Record<string, boolean>>('languages', {});
        return languages[languageId] !== false;
    }

    getMinCallCount(): number {
        return this.config.get<number>('minCallCount', 1);
    }

    getDebounceMs(): number {
        return this.config.get<number>('debounceMs', 300);
    }
}

export const configManager = new ConfigManager();
