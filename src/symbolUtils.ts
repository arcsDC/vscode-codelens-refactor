import * as vscode from 'vscode';

export async function getFunctionSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]> {
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', document.uri);
    if (!symbols) {
        return [];
    }

    const functions: vscode.DocumentSymbol[] = [];
    const stack = [...symbols];

    while (stack.length > 0) {
        const symbol = stack.pop()!;
        if (symbol.kind === vscode.SymbolKind.Function || symbol.kind === vscode.SymbolKind.Method) {
            functions.push(symbol);
        }
        if (symbol.children) {
            stack.push(...symbol.children);
        }
    }

    return functions;
}
