//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();

  let commits = [];

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "runDefectGuard": {
        runDefectGuard(message.data);
        break;
      }
    }
  });

  /**
   * @param {any[]} commits
   */
  function updateCommitList(commits) {
    const ul = document.querySelector(".commit-list");
    ul.textContent = "";
    for (const commit of commits) {
      const li = document.createElement("li");
      li.className = "commit-entry";

      const commitHash = document.createElement("div");
      commitHash.className = "commit-hash";
      commitHash.textContent = commit.commit_hash;
      // commitHash.addEventListener('click', () => {
      //     onColorClicked(color.value);
      // });
      li.appendChild(commitHash);

      const commitDefectProb = document.createElement("div");
      commitDefectProb.className = "commit-defect-probability";
      const value = parseFloat(commit.predict);
      var hue = ((1 - value) * 120).toString(10);
      commitDefectProb.style.backgroundColor = ["hsl(", hue, ",100%,50%)"].join(
        ""
      );

      const styledText = document.createElement("span");
      var re_hue = (value * 120).toString(10);
      styledText.className = "probability";
      styledText.textContent = value + "";
      styledText.style.color = ["hsl(", re_hue, ",100%,50%)"].join("");
      commitDefectProb.appendChild(styledText);
      // commitDefectProb.addEventListener('change', (e) => {
      //     const value = e.target.value;
      //     if (!value) {
      //         // Treat empty value as delete
      //         commits.splice(commits.indexOf(color), 1);
      //     } else {
      //         color.value = value;
      //     }
      //     updateColorList(commits);
      // });
      li.appendChild(commitDefectProb);

      ul.appendChild(li);
    }

    // Update the saved state
    vscode.setState({ commits: commits });
  }

  /**
   * @param {any} defectGuardOutput
   */
  function runDefectGuard(defectGuardOutput) {
    for (const commit of defectGuardOutput.deepjit) {
      commits.push(commit);
    }
    updateCommitList(commits);
  }
})();
