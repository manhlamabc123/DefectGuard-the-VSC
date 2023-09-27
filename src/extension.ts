import * as vscode from 'vscode';
import { checkInstalledTools, installDefectGuard, callDefectGuard } from './utils/utils'
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const provider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, provider));

	checkInstalledTools();
	installDefectGuard();

	const commitHash = '5f2188e336add1b6798c822c0c180d2603d75807'

	vscode.workspace.onDidOpenTextDocument(() => {
		const predict = callDefectGuard();
		provider.runDefectGuard(commitHash, predict);
	});

	vscode.workspace.onDidSaveTextDocument(() => {
		const predict = callDefectGuard();
		provider.runDefectGuard(commitHash, predict);
	})
}

export function deactivate() { }
