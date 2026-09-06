import * as vscode from 'vscode';
import { getFunctionSymbols } from './symbolUtils';
import { callCounter } from './callCounter';
import { configManager } from './config';

export class CodeLensRefactorProvider implements vscode.CodeLensProvider {
    private onDidChangeEmitter = new vscode.EventEmitter<void>();
    public onDidChangeCodeLenses = this.onDidChangeEmitter.event;

    refresh(): void {
        this.onDidChangeEmitter.fire();
    }

    async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {
        if (!configManager.isEnabled(document.languageId)) {
            return [];
        }

        const symbols = await getFunctionSymbols(document, token);
        const lenses: vscode.CodeLens[] = [];
        const minCount = configManager.getMinCallCount();

        for (const symbol of symbols) {
            const range = symbol.range;
            const count = await callCounter.getCount(document, symbol.name, token);

            if (count >= minCount) {
                const lens = new vscode.CodeLens(range, {
                    title: `$(${count} calls)`,
                    command: 'codelensRefactor.rename',
                    arguments: [document, range]
                });
                lenses.push(lens);
            }
        }

        return lenses;
    }
}
