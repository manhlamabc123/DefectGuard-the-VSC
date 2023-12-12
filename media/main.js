//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  let commits = [];

  // Get a reference to the select element
  var languageSelect = document.getElementById("language");

  // Add an event listener to the select element
  // @ts-ignore
  languageSelect.addEventListener("input", function () {
    // Get the selected value
    // @ts-ignore
    var selectedLanguage = languageSelect.value;

    // Send a message to the extension with the selected language
    vscode.postMessage({
      type: "selectLanguage",
      data: selectedLanguage,
    });
  });

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
    // @ts-ignore
    ul.textContent = "";

    // Sort the commits by probability (descending order)
    commits.sort((a, b) => parseFloat(b.predict) - parseFloat(a.predict));

    for (const commit of commits) {
      const predictValue = parseFloat(commit.predict);

      let predict, hue;

      if (predictValue === -1) {
          // // Handle the case when commit.predict is -1
          // hue = '0';
          // predict = '';  // Or any other default value you prefer
          continue;
      } else {
          predict = (predictValue * 100).toFixed(2) + "%";
          hue = ((1 - predictValue) * 120).toString(10);
      }

      const li = document.createElement("li");
      li.className = "commit-box";

      const commitInfo = document.createElement("div");
      commitInfo.className = "commit-info";

      const commitHash = document.createElement("span");
      commitHash.className = "commit-hash";
      commitHash.textContent = commit.commit_hash;

      const probability = document.createElement("span");
      probability.className = "probability";
      probability.textContent = predict;

      commitInfo.appendChild(commitHash);
      commitInfo.appendChild(probability);

      const commitBg = document.createElement("div");
      commitBg.className = "commit-bg";

      const commitBar = document.createElement("div");
      commitBar.className = "commit-bar";
      commitBar.style.width = predict;
      commitBar.style.backgroundColor = ["hsl(", hue, ",100%,50%)"].join("");

      commitBg.appendChild(commitBar);

      li.appendChild(commitInfo);
      li.appendChild(commitBg);

      // @ts-ignore
      ul.appendChild(li);
    }

    // Update the saved state
    vscode.setState({ commits: commits });
  }

  /**
   * @param {any} defectGuardOutput
   */
  function runDefectGuard(defectGuardOutput) {
    commits = [];
    for (const commit of defectGuardOutput.deepjit) {
      commits.push(commit);
    }

    updateCommitList(commits);
  }
})();
