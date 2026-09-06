# vscode-codelens-refactor

A VS Code extension that displays call-site counts above function declarations and triggers native rename actions.

## Stack

Primary language: **TypeScript**

## Project structure

- `src/extension.ts` — Entry point that registers the CodeLens provider, command handlers, and configuration listeners.
- `package.json` — extension manifest with activation events and configuration schema
- `src/lensProvider.ts` — CodeLensProvider implementation generating lenses for function symbols
- `src/callCounter.ts` — Debounced workspace call-site counter with in-memory caching
- `src/symbolUtils.ts` — Utilities to filter document symbols for function declarations
- `src/config.ts` — Configuration manager reading and watching extension settings
- `src/commands.ts` — Command handler invoking the native rename action
- `tsconfig.json` — TypeScript compiler configuration

## Usage

Review the source files and install any dependencies referenced by the project before running it.
