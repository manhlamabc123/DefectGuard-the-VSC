import * as vscode from 'vscode';
import { checkInstalledTools, installDefectGuard, callDefectGuard } from './utils/utils'
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const provider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, provider));

	checkInstalledTools();
	installDefectGuard();

	vscode.workspace.onDidOpenTextDocument(async () => {
		const defectGuardOutput = await callDefectGuard();
		provider.runDefectGuard(defectGuardOutput);
	});

	vscode.workspace.onDidSaveTextDocument(async () => {
		const defectGuardOutput = await callDefectGuard();
		provider.runDefectGuard(defectGuardOutput);
	})
}

export function deactivate() { }
