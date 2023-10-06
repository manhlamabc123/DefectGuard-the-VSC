import * as vscode from 'vscode';
import { exec } from 'child_process';

function isToolInstalled(toolName: string): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		exec(`${toolName} --version`, (error, stdout, stderr) => {
			console.log(stdout);
			if (!error) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
}

export async function checkInstalledTools() {
	const gitInstalled = await isToolInstalled('git');
	const pythonInstalled = await isToolInstalled('python3');
	const pipInstalled = await isToolInstalled('pip');

	console.log(`Git is installed: ${gitInstalled}`);
	console.log(`Python is installed: ${pythonInstalled}`);
	console.log(`pip is installed: ${pipInstalled}`);

	if (!gitInstalled) {
		vscode.window.showErrorMessage(
			'Git is not installed. Please install Git.'
		);
	}

	if (!pythonInstalled) {
		vscode.window.showErrorMessage(
			'Python is not installed. Please install Python.'
		);
	}

	if (!pipInstalled) {
		vscode.window.showErrorMessage(
			'Pip is not installed. Please install Pip.'
		);
	}
}

export function installDefectGuard() {
	const command = 'pip install -i https://test.pypi.org/simple/ defectguard==0.1.26';

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error installing DefectGuard: ${error.message}`);
			return;
		}

		if (stderr) {
			console.error(`Error installing DefectGuard: ${stderr}`);
			return;
		}
	});
}

export function callDefectGuard(): Promise<Object> {
	let wf = vscode.workspace.workspaceFolders[0].uri.path;
	const command = `defectguard -models deepjit -dataset platform -repo ${wf} -commit_hash dedbc4ed5b953ac03854c83e0b91dd56f4fd1f1e e07e944afd5435a367c8b1789cda20d7c52240c3 -main_language C`;

	return new Promise<Object>((resolve) => {
		exec(command, (error, stdout, stderr) => {
			const jsonStringWithDoubleQuotes = stdout.replace(/'/g, '"');
			var json = JSON.parse(jsonStringWithDoubleQuotes)
			if (!error) {
				resolve(json);
			} else {
				console.log(stderr)
				resolve({});
			}
		});
	});
}