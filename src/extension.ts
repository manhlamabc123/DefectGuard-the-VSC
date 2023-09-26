import * as vscode from 'vscode';
import { checkInstalledTools, installDefectGuard, callDefectGuard } from './utils/utils'
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const provider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, provider));

	checkInstalledTools();
	installDefectGuard();

	vscode.workspace.onDidSaveTextDocument(() => {
		callDefectGuard();
	})

	let disposable = vscode.commands.registerCommand('defectguard.helloWorld', () => {
		vscode.window.showInformationMessage('DefectGuard is working!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
