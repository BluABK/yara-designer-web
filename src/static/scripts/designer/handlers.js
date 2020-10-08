import {
    BGCOLOR_RED_CLASS, BGCOLOR_YELLOW_CLASS, FAILED_ICON,
    NUMBERED_TEXTBOX_CLASS, SUCCESS_ICON, SYNTAX_ERROR
} from "./editor/common.js";
import {escapeHtml, printGitDiff, printGitLogEntry} from "../modules/utils.js";
import {
    closeModals, CONFIRMATION_MODAL,
    MODAL_DEFAULT_FOOTER,
    popupModal, RESPONSE_MODAL,
    RESPONSE_MODAL_BUTTON_COMMIT,
    RESPONSE_MODAL_BUTTON_COMMIT_CLASS,
    RESPONSE_MODAL_BUTTON_COMMIT_DISABLED_CLASS
} from "../modules/modals.js";
import {makeCollapsibleJSONDetails} from "./designer_modals.js";
import {fetchPostRequest} from "./requests.js";
import * as levels from "../modules/levels.js";

/**
 * Handles the returned response to postRule.
 * @param json
 */
export function handlePostRuleResponse(json) {
    console.log("handlePostRuleResponse JSON", json);
    let errorType = "";
    let errorMessage = "";
    let errorLineNumber = 0;
    let errorColumnNumber = 0;
    let errorColumnRange = 0;
    let errorWord = "";
    let level = "success";
    let warningType = "";
    let warningMessage = "";
    let warningLineNumber = 0;
    let warningWord = "";

    // Parse JSON:
    let outJson = json["out"];

    let compilable = outJson["compilable"];
    let success = outJson["success"];
    let hasWarning = outJson["has_warning"];

    let yaraRuleSourceCode = outJson["source_code"];

    window.currentlyLoadedRule["source_path"] = outJson["source_path"];

    if (hasWarning) {
        level = "warning";
        warningType = outJson["warning"]["type"];
        warningMessage = outJson["warning"]["message"];
        warningLineNumber = outJson["warning"]["line_number"];
        warningWord = outJson["warning"]["word"]
    }

    if (!compilable) {
        level = "warning";
    }

    if (!success) {
        errorMessage = outJson["error"]["message"];
        errorType = outJson["error"]["type"];
        errorLineNumber = parseInt(outJson["error"]["line_number"]);
        errorColumnNumber = parseInt(outJson["error"]["column_number"]);
        errorColumnRange = parseInt(outJson["error"]["column_range"]);
        errorWord = outJson["error"]["word"];
        level = "error";
    }

    // Define header
    let header = `<h2>YARA rule generation results: ${String(level).toUpperCase()}</h2>`;

    // Define body
    let body = "";

    // Passed/Failed items.
    body += "<p>" + (compilable === true ? SUCCESS_ICON : FAILED_ICON) + " Compiles </p>";

    // Error message (if any).
    if (!success) {
        body += `<p>${errorType.replace(/^\w/, c => c.toUpperCase())} error message: ${escapeHtml(errorMessage)}</p>`;
    }

    if (hasWarning) {
        body += `<p>${warningType.replace(/^\w/, c => c.toUpperCase())} warning message: ${escapeHtml(warningMessage)}</p>`;
    }

    // Formatted string of the generated YARA rule ("source").
    body += "<br/>Generated YARA rule:<br/>";

    // Loop through lines to add line numbering support via CSS counter.
    let lines = String(yaraRuleSourceCode).split('\n');
    body += `<pre class='${NUMBERED_TEXTBOX_CLASS}'>`;
    for (let i = 0; i < lines.length; i++) {
        console.log(`Line number ${i}`, lines[i]);
        if (!success) {
            if (errorType === SYNTAX_ERROR && i === errorLineNumber-1) {
                // Color bad column or line.
                let stringUpToMark = lines[i].substring(0, errorColumnNumber -1);
                let stringToMark = lines[i].substring(errorColumnNumber -1, errorColumnRange - 1);
                let stringPastMark = lines[i].substring(errorColumnRange -1, lines[i].length);

                // FIXME: Debug syntax error marking (not sure it is quite over yet).
                // console.log("stringUpToMark: " + stringUpToMark);
                // console.log(`stringToMark: '${stringToMark}'`);
                // console.log("stringPastMark: " + stringPastMark);

                lines[i] = `${stringUpToMark}<mark class='${BGCOLOR_RED_CLASS}'>${stringToMark}</mark>${stringPastMark}`;
            }
        }
        if (hasWarning) {
            if (i+1 === warningLineNumber) {
                lines[i] = `<mark class='${BGCOLOR_YELLOW_CLASS}'>${lines[i]}</mark>`; //FIXME: Broken (never shows).
            }
        }

        // Append line
        body += `<span>${escapeHtml(lines[i])}</span>`;
    }
    body += "</pre>";

    // Add commit button if valid result.
    if (success) {
        body += `<button id="${RESPONSE_MODAL_BUTTON_COMMIT}" class="${RESPONSE_MODAL_BUTTON_COMMIT_CLASS}">Commit & Push</button>`;
    } else {
        body += `<button id="${RESPONSE_MODAL_BUTTON_COMMIT}" class="${RESPONSE_MODAL_BUTTON_COMMIT_DISABLED_CLASS}" disabled>Commit & Push</button>`;
    }

    // Collapsible raw JSON details.
    body += makeCollapsibleJSONDetails(json, 'collapsible-json-details-post-rule');

    // Spawn modal.
    popupModal(RESPONSE_MODAL, header, null, body, null, MODAL_DEFAULT_FOOTER, level);

    // Perform changes that requires a spawned modal:

    // Add bindings to buttons.
    document.getElementById(RESPONSE_MODAL_BUTTON_COMMIT).onclick = function() {
        // Perform bound action.
        let jsonToCommit = {
            "source_path": window.currentlyLoadedRule["source_path"],
            "name": window.currentlyLoadedRule["name"],
            "thehive_case_id": window.currentlyLoadedRule["thehive_case_id"]
        };

        console.log("Committing generated YARA rule to TheOracle Git...", jsonToCommit);
        fetchPostRequest(POST_COMMIT_ROUTE, jsonToCommit, handlePostCommitResponse, null, true,
            "Commit generated YARA rule", "Committing generated YARA rule and pushing to TheOracle Git..").then();

        // Close modal after handling button action.
        document.getElementById(CONFIRMATION_MODAL).style.display = "none";
    };
}

export function handlePostCommitResponse(json) {
    // Make sure to close any open modals.
    closeModals();

    let errorType = "";
    let errorMessage = "";
    let level = levels.SUCCESS;

    // Parse JSON:
    let outJson = json["out"];

    // let compilable = outJson["compilable"];
    let success = outJson["success"];

    if (!success) {
        errorMessage = outJson["error"]["message"];
        errorType = outJson["error"]["type"];
        level = outJson["error"].hasOwnProperty("level") ? outJson["error"]["level"] : levels.ERROR;

        console.log("errorMessage: " + errorMessage);
        console.log("errorType: " + errorType);
        console.log("level: " + level);
    }

    // Define header
    let header = `<h2>YARA rule commit & push results: ${String(level).toUpperCase()}</h2>`;

    // Define body
    let body = "";

    // Error message (if any).
    if (!success) {
        body += `<p>${errorType.replace(/^\w/, c => c.toUpperCase())} ${level} message: ${errorMessage}</p>`;
    }

    // Main (body) contents.
    if (success) {
        let commit = outJson["commit"];
        body += printGitLogEntry(commit["hexsha"], commit["author_username"], commit["author_email"],
                                 commit["committed_date_custom"], commit["message"]);
        body += "<br/><br/>";
        body += printGitDiff(commit["diff"], true);
    }

    // Collapsible raw JSON details.
    body += makeCollapsibleJSONDetails(json, 'collapsible-json-details-post-commit-response');

    // Spawn modal.
    popupModal(RESPONSE_MODAL, header, null, body, null, MODAL_DEFAULT_FOOTER, level);
}