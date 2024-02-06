/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('language-tools', 'packages', 'language-server', 'bin', 'server.js')
	);

	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	const virtualDocumentContents = new Map<string, string>();

	workspace.registerTextDocumentContentProvider('embedded-content', {
		provideTextDocumentContent: uri => {
			const originalUri = uri.path.slice(1).slice(0, -7);
			const decodedUri = decodeURIComponent(originalUri);
			return virtualDocumentContents.get(decodedUri);
		}
	});

	function maskContent(text, subText, char=' ') {
		// Escape special characters in subText for use in a regular expression
		const escapedSubText = subText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	
		// Split the text by subText, but keep subText in the result
		const parts = text.split(new RegExp(`(${escapedSubText})`));
	
		// Mask non-whitespace characters in parts that are not subText
		const maskedParts = parts.map(part => 
			part === subText ? part : part.replace(/[^\s\n]/g, char)
		);
	
		// Rejoin the parts into a single string
		return maskedParts.join('');
	}

	function isSvelteInScope(document, position?, range?) {
		let docText = document.getText();
		const specialDocStringRegex = /class\s+Client:\s*?\n\s*"""@\s*([\s\S]*?)\s*"""/g;
		let match = specialDocStringRegex.exec(docText);
	
		if (match) {
			let matchStart = match.index;
			let matchEnd = match.index + match[0].length;
	
			// Check if position is within the matched range
			if (position && document.offsetAt(position) >= matchStart && document.offsetAt(position) <= matchEnd) {
				return true
			}
			// Check if range is within the matched range
			else if (range && document.offsetAt(range.start) >= matchStart && document.offsetAt(range.end) <= matchEnd) {
				return true
			}
			// If neither position nor range is specified, or they are not within the matched range
			else if (!position && !range) {
				return true
			}
		}
		return false
	}

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'python' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		},
		middleware: {
			sendRequest: async (type, param, token, next) =>  {
				let result = await next(type, param, token)
				// console.log('sendRequest', type, result)
				return result
			},

			provideHover: async (document, position, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document, position)
				if (hasSvelte) {
					let result = await next(document, position, token)
					// console.log('provideHover', {document, position, token, result})
					return result
				}
			},
			resolveCompletionItem: async (item, token, next) => {
				let result = await next(item, token)
				// console.log('resolveCompletionItem', {item, token, result})
				return result
			},
			provideDocumentColors: async (document, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document)
				if (hasSvelte) {
					let result = await next(document, token)
					// console.log('provideDocumentColors', {document, token, result})
					return result
				}
			},
			provideInlineCompletionItems: async (document, position, context, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document, position)
				if (hasSvelte) {
					let result = await next(document, position, context, token)
					// console.log('provideInlineCompletionItems', {document, position, context, token, result})
					return result
				}
			},
			provideDefinition: async (document, position, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document, position)
				if (hasSvelte) {
					let result = await next(document, position, token)
					// console.log('provideDefinition', {document, position, token, result})
					return result
				}
			},
			provideDocumentSemanticTokens: async (document, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document)
				if (hasSvelte) {
					let result = await next(document, token)
					// console.log('provideDocumentSemanticTokens', {document, token, result})
					return result
				}
			},
			provideDocumentRangeSemanticTokens: async (document, range, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document, null, range)
				if (hasSvelte) {
					let result = await next(document, range, token)
					// console.log('provideDocumentSemanticTokens', {document, range, token, result})
					return result
				}
			},
			provideCodeActions: async (document, range, context, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document, null, range)
				if (hasSvelte) {
					let result = await next(document, range, context, token)
					// console.log('provideCodeActions', {document, range, context, token, result})
					return result
				}
			},
			provideCompletionItem: async (document, position, context, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document, position)
				if (hasSvelte) {
					let result = await next(document, position, context, token)
					// console.log('provideCompletionItem', {document, position, context, token, result})
					return result
				}
			},
			provideDocumentSymbols: async (document, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document)
				if (hasSvelte) {
					let result = await next(document, token)
					// console.log('provideDocumentSymbols', {document, token, result})
					return result
				}
			},
			provideFoldingRanges: async (document, context, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document)
				if (hasSvelte) {
					let result = await next(document, context, token)
					// console.log('provideFoldingRanges', {document, context, token, result})
					return result
				}
			},
			provideInlayHints: async (document, viewPort, token, next) => {  // SCOPE
				let hasSvelte = isSvelteInScope(document, null, viewPort)
				if (hasSvelte) {
					let result = await next(document, viewPort, token)
					// console.log('provideInlayHints', {document, viewPort, token, result})
					return result
				}
			}
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'streamjamLS',
		'StreamJam Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
