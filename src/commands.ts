import * as vscode from 'vscode';

export function registerCommands(context: vscode.ExtensionContext): void {
    const renameCommand = vscode.commands.registerCommand('codelensRefactor.rename', async (document: vscode.TextDocument, range: vscode.Range) => {
        try {
            const position = new vscode.Position(range.start.line, range.start.character);
            await vscode.commands.executeCommand('editor.action.rename', document.uri, position);
        } catch (error) {
            vscode.window.showErrorMessage('Rename action failed. Please check for syntax errors.');
        }
    });

    context.subscriptions.push(renameCommand);
}
