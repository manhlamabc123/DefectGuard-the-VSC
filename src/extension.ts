// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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

async function checkInstalledTools() {
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

function installDefectGuard() {
	const command = 'pip install -i https://test.pypi.org/simple/ defectguard';

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error installing DefectGuard: ${error.message}`);
			return;
		}

		if (stderr) {
			console.error(`Error installing DefectGuard: ${stderr}`);
			return;
		}

		console.log('DefectGuard installed successfully.');
	});
}

function callDefectGuard() {
	const command = 'defectguard -h';

	exec(command, (error, stdout, stderr) => {
		console.log(stdout);
		if (error) {
			console.error(`DefectGuard: ${error.message}`);
			return;
		}

		if (stderr) {
			console.error(`DefectGuard: ${stderr}`);
			return;
		}
	});
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	checkInstalledTools();
	installDefectGuard();

	vscode.workspace.onDidSaveTextDocument(() => {
		callDefectGuard();
	})

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "defectguard" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('defectguard.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('DefectGuard is working!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
