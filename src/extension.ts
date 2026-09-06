import * as vscode from 'vscode';
import { CodeLensRefactorProvider } from './lensProvider';
import { registerCommands } from './commands';
import { configManager } from './config';

export function activate(context: vscode.ExtensionContext) {
    const provider = new CodeLensRefactorProvider();

    const selector: vscode.DocumentSelector = [
        { language: 'typescript', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' },
        { language: 'javascript', scheme: 'file' },
        { language: 'javascriptreact', scheme: 'file' },
        { language: 'python', scheme: 'file' }
    ];

    const lensRegistration = vscode.languages.registerCodeLensProvider(selector, provider);
    context.subscriptions.push(lensRegistration);

    registerCommands(context);

    const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('codelensRefactor')) {
            configManager.refresh();
            provider.refresh();
        }
    });
    context.subscriptions.push(configListener);

    const editorListener = vscode.window.onDidChangeActiveTextEditor(() => {
        provider.refresh();
    });
    context.subscriptions.push(editorListener);
}

export function deactivate() {}
