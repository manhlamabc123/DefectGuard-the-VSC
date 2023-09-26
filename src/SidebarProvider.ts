import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'defect-guard-sidebar';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'colorSelected':
                    {
                        vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
                        break;
                    }
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Cat Colors</title>
			</head>
			<body>
                <h3>Defect Guard</h3>
                <p>A cutting-edge defect prediction tool with up-to-date Just-in-Time techniques and a robust API</p>
				<ul>
                    <li class="commit-entry">
                        <div class="commit-hash">5f2188e336add1b6798c822c0c180d2603d75807</div>
                        <div class="commit-defect-probability" data-value="0.5"></div>
                    </li>
                    <li class="commit-entry">
                        <div class="commit-hash">5f2188e336add1b6798c822c0c180d2603d75807</div>
                        <div class="commit-defect-probability" data-value="0.5"></div>
                    </li>
                    <li class="commit-entry">
                        <div class="commit-hash">5f2188e336add1b6798c822c0c180d2603d75807</div>
                        <div class="commit-defect-probability" data-value="0.5"></div>
                    </li>  
                    <li class="commit-entry">
                        <div class="commit-hash">5f2188e336add1b6798c822c0c180d2603d75807</div>
                        <div class="commit-defect-probability" data-value="0.5"></div>
                    </li>  
                    <li class="commit-entry">
                        <div class="commit-hash">5f2188e336add1b6798c822c0c180d2603d75807</div>
                        <div class="commit-defect-probability" data-value="0.5"></div>
                    </li>  
                </ul>

                <button class="run-button">Run Defect Guard</button>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}