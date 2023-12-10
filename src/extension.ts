import * as vscode from 'vscode';
import { checkInstalledTools, installDefectGuard, callDefectGuard } from './utils/utils'
import { SidebarProvider } from './SidebarProvider';

export async function activate(context: vscode.ExtensionContext) {
	const provider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, provider));

	checkInstalledTools();
	installDefectGuard();
	const mainLanguage = provider.selectedLanguage;
	const defectGuardOutput = await callDefectGuard(mainLanguage);
	provider.runDefectGuard(defectGuardOutput);

	vscode.workspace.onDidChangeWorkspaceFolders(async () => {
		const mainLanguage = provider.selectedLanguage;
		const defectGuardOutput = await callDefectGuard(mainLanguage);
		provider.runDefectGuard(defectGuardOutput);
	});

	vscode.workspace.onDidOpenTextDocument(async () => {
		const mainLanguage = provider.selectedLanguage;
		const defectGuardOutput = await callDefectGuard(mainLanguage);
		provider.runDefectGuard(defectGuardOutput);
	});

	vscode.workspace.onDidSaveTextDocument(async () => {
		const mainLanguage = provider.selectedLanguage;
		const defectGuardOutput = await callDefectGuard(mainLanguage);
		provider.runDefectGuard(defectGuardOutput);
	})
}

export function deactivate() { }
