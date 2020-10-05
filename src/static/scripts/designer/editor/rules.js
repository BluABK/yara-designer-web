import {fetchGetRequest} from "../requests.js";
import {humanizeISODate, isIterable, updateURLParameter, containsHtmlComment, getHtmlCommentData} from "../../modules/utils.js";
import * as modals from "../../modules/modals.js";
import {
    CUSTOM_TABLE_CONTAINER, RULE_KIND_DB, RULE_KIND_THEORACLE,
    RULES_TABLE, SIZE_FULLWIDTH_CLASS,
    TABLE_FILTER_CHECKED_RADIO,
    TABLE_FILTER_COUNT,
    TABLE_FILTER_HIDDEN_RADIOS, TABLE_FILTER_INPUT_SUFFIX,
    TABLE_FILTER_RADIO_CLASS_SUFFIX
} from "../../constants.js";
import * as levels from "../../modules/levels.js";
import {
    setTitle, setTags, clearEditorDivContents, setYARAStrings, setEditorElementsByCondition, addStringsFromRule,
    getEditorContents
} from "./common.js";
import {popupConfirmationModal} from "../../modules/modals.js";
import {makeTable, comparer} from "../../modules/tables.js";

export function clearRule() {
    // Define body
    let body = "<h3>Are you sure you want to clear the current rule? This is action is <em>irreversible</em>.</h3>";

    // yesAction, noAction, body, args...
    popupConfirmationModal([{"action": clearEditorDivContents}], null, body);
}

/**
 * @param {Object} rule Rule
 */
export function extrapolateMissingRuleInfoFromMeta(rule) {
    let title = null;
    let caseId = null;
    let description = null;
    let modifiedRule = rule;

    if (rule.title) {
        title = rule.title;
    }

    if (!rule.title.includes(' ')) {
        // If there are no whitespaces, the rule title is likely determined by the rule name.
        // In which case we should replace all _ with ' '.
        title = rule.title.replace(/[_-]/g, ' ');
    }

    if (rule.thehive_case_id) {
        caseId = rule.thehive_case_id;
    } else {
        if ( rule.meta.some(item => item.identifier.toLowerCase() === "thehive_case_id") ) {
            caseId = rule.meta.find(item => item.identifier.toLowerCase() === "thehive_case_id").value;
        } else if ( rule.meta.some(item => item.identifier.toLowerCase() === "case_id") ) {
            caseId = rule.meta.find(item => item.identifier.toLowerCase() === "case_id").value;
        } else if ( rule.meta.some(item => item.identifier.toLowerCase() === "id") ) {
            caseId = rule.meta.find(item => item.identifier.toLowerCase() === "id").value;
        }
    }

    if (rule.description) {
        description = rule.description;
    } else {
        if ( rule.meta.some(item => item.identifier.toLowerCase() === "description") ) {
            description = rule.meta.find(item => item.identifier.toLowerCase() === "description").value;
        }
    }

    modifiedRule.title = title;
    modifiedRule.thehive_case_id = caseId;
    modifiedRule.description = description;

    return modifiedRule;
}

export function extrapolateMissingRulesInfoFromMeta(rules) {
    let modifiedRules = [];

    for (let rule of rules) {
        modifiedRules.push(extrapolateMissingRuleInfoFromMeta(rule));
    }

    return modifiedRules
}

export function getRuleDBById(ruleId, callback=displayRulesTable) {
    console.log("DEBUG: getRuleDBById(callback=displayRulesTable)");
    // noinspection JSIgnoredPromiseFromCall
    fetchGetRequest(`${GET_RULE_ROUTE}/${ruleId}`, callback);
}

export function getTheOracleRuleByFilename(filename, callback=displayRulesTable) {
    console.log("DEBUG: getTheOracleRuleByFilename(callback=displayRulesTable)");
    // noinspection JSIgnoredPromiseFromCall
    fetchGetRequest(`${GET_THEORACLE_RULE_ROUTE}/${filename}`, callback);
}

export function combineRulesThenPrintRulesTable(additionalRules, existingRules) {
    let combinedRules = {
        "db_rules": extrapolateMissingRulesInfoFromMeta(existingRules["rules"]),
        "theoracle_rules": extrapolateMissingRulesInfoFromMeta(additionalRules["rules"])
    };
    // let extrapolatedCombinedRules = extrapolateMissingRulesInfoFromMeta(combinedRules);

    displayRulesTable(combinedRules);
}

export function getAdditionalRules(rules, callback=combineRulesThenPrintRulesTable) {
    // Carry received rules into the fetch request
    console.log("Getting rules (2/2): YARA rules from TheOracle...");
    fetchGetRequest(GET_THEORACLE_RULES_ROUTE, callback, rules,
        true, "Getting rules (2/2): YARA rules from TheOracle...");
}

export function getRules(callback=getAdditionalRules) {
    console.log("Getting rules (1/2): TheHive cases from DB...");
    fetchGetRequest(GET_RULES_ROUTE, callback, null,
        true, "Getting rules (1/2): TheHive cases from DB...");
}

export function getRulesDB(callback=displayRulesTable) {
    console.log("Getting TheHive cases from DB...");
    fetchGetRequest(GET_RULES_ROUTE, callback, null,
        true, "Getting TheHive cases from DB...");
}

export function getRulesTheOracle(callback=displayRulesTable) {
    console.log("Getting YARA rules from TheOracle...");
    fetchGetRequest(GET_THEORACLE_RULES_ROUTE, callback, null,
        true, "Getting YARA rules from TheOracle...");
}

/**
 * Loads a YARA Rule (callback function called by getRule).
 *
 * @param rule  YARA Rule.
 */
export function loadRuleCallback(rule) {
    // Clear editor.
    clearEditorDivContents();

    console.log("Loading rule...", rule);

    // Extrapolate missing info from metadata, if available.
    rule = extrapolateMissingRuleInfoFromMeta(rule);

    // Set the currently loaded rule global variable (used in other functions).
    window.currentlyLoadedRule = rule;

    // Update the address bar URL (if able).
    if (rule.source_filename) {
        window.history.replaceState('', '', updateURLParameter(window.location.href, "id", undefined));
        window.history.replaceState('', '', updateURLParameter(window.location.href, "filename", rule.source_filename));
    } else if (rule.thehive_case_id) {
        window.history.replaceState('', '', updateURLParameter(window.location.href, "filename", undefined));
        window.history.replaceState('', '', updateURLParameter(window.location.href, "id", rule.thehive_case_id));
    } else {
        window.history.replaceState('', '', updateURLParameter(window.location.href, "filename", undefined));
        window.history.replaceState('', '', updateURLParameter(window.location.href, "id", undefined));
    }

    // Set title tag and title div.
    setTitle(
        rule.title ? rule.title : "Untitled Rule.",
        rule.thehive_case_id ? rule.thehive_case_id : "N/A",
        rule.description ? rule.description : "No description"
    );

    // Set tags div.
    setTags(rule.tags);

    // Set YARA String divs.
    setYARAStrings(rule.strings);

    // Set editor condition:
    setEditorElementsByCondition(rule.condition);

}

export function newRule() {
    let rule = {
      "added_on": null,
      "compilable": null,
      "condition": [],
      "condition_str": "",
      "last_modified": null,
      "meta": [],
      "name": "Untitled",
      "namespace": null,
      "pending": false,
      "processing_time": null,
      "source_filename": null,
      "source_path": null,
      "source_path_sha256sum": null,
      "strings": [],
      "tags": [],
      "thehive_case_id": null,
      "title": "Untitled",
      "description": "No description"
    };

    loadRuleCallback(rule);
}

/**
 * Loads a YARA Rule by calling getRule with a callback.
 *
 * @param ruleId
 */
export function loadDBRuleById(ruleId) {
    getRuleDBById(ruleId, loadRuleCallback);
}

/**
 * Loads a YARA Rule by calling getRule with a callback.
 *
 * @param ruleFileName
 */
export function loadTheOracleRuleByFilename(ruleFileName) {
    getTheOracleRuleByFilename(ruleFileName, loadRuleCallback);
}

/**
 * Loads a YARA Rule by calling getRule with a callback.
 *
 * @param rulesJson
 */
export function loadObservablesHandler(rulesJson) {
    displayRulesTable({"db_rules": rulesJson["rules"]}, TABLE_FILTER_CHECKED_RADIO, TABLE_FILTER_HIDDEN_RADIOS,
        modals.RESPONSE_MODAL, "append", loadObservablesLoader);
}

export function loadObservablesLoader(ruleId) {
    getRuleDBById(ruleId, addStringsFromRule);
}

export function makeRuleTableRows(rules) {
    let headerContentMaps = [];

    if (isIterable(rules) !== true) {
        rules = Array(rules);
    }

    for (let rule of rules) {
        headerContentMaps.push({
            "<!--Pending-->": "",  // Value intentionally left blank (to be filled with pending bar later).
            "Kind": rule.kind,
            "Title": rule.title,
            "Tags #": rule.tags.length,
            "Metadata #": rule.meta.length,
            "Strings #": rule.strings.length,
            "Added": rule.added_on !== null ? humanizeISODate(rule.added_on) : "N/A",
            "YARA File": rule["source_path"] !== null ? rule["source_path"] : "N/A",
            "Modified": rule.last_modified !== null ? humanizeISODate(rule.last_modified): "N/A",
            "Case ID": rule.thehive_case_id
        });
    }

    return headerContentMaps;
}

export function filterFetchedRules(inputId, tableId, filterRadioId, filterCountCallback=null) {
    let input = document.getElementById(inputId);
    let filter = input.value.toUpperCase();
    let table = document.getElementById(tableId);
    let filterRadios = document.getElementById(filterRadioId).getElementsByTagName('input');

    // Get all table row elements.
    let tr = table.getElementsByTagName("tr");

    // Get the currently checked radio button.
    let enabledTd = 0;
    for (let idx = 0; idx < filterRadios.length; idx++) {
        if (filterRadios[idx].checked) {
            enabledTd = idx;
        }
    }

    // Loop through all table rows, and hide those who don't match the search query
    let filterCount = 0;
    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[enabledTd];

        if (td) {
            let txtValue = td.textContent || td.innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
                filterCount++;
            }
        }
    }

    // Report statistics to a callback (if defined).
    filterCountCallback && filterCountCallback(filterCount);
}

export function filterCountCallback(filterCount, modalId = modals.RESPONSE_MODAL) {
    let filtercountElement = document.getElementById(
        `${modalId}-${modals.MODAL_HEADER}-${TABLE_FILTER_COUNT}`);

    filtercountElement.innerText = filterCount > 0 ? `(filtered: ${filterCount})` : "";
}

/**
 * Print fetched rules table.
 *
 * Customised printTable code for fetched rules.
 *
 * @param rulesJson
 * @param defaultCheckedRadio
 * @param hideRadios
 * @param modalId
 * @param loaderMode
 * @param ruleKindDBLoader
 * @param ruleKindTheOracleLoader
 */
export function displayRulesTable(rulesJson, defaultCheckedRadio = TABLE_FILTER_CHECKED_RADIO,
                         hideRadios = TABLE_FILTER_HIDDEN_RADIOS, modalId = modals.RESPONSE_MODAL,
                         loaderMode = "replace",
                         ruleKindDBLoader=loadDBRuleById, ruleKindTheOracleLoader=loadTheOracleRuleByFilename) {
    // let rules = rulesJson["rules"];
    let rules = [];
    if ( rulesJson.hasOwnProperty("db_rules") ) {
        for (let dbRule of rulesJson["db_rules"]) {
            dbRule["kind"] = "database";
            rules.push(dbRule);
        }
    }
    if ( rulesJson.hasOwnProperty("theoracle_rules") ) {
        for (let theoracleRule of rulesJson["theoracle_rules"]) {
            theoracleRule["kind"] = "theoracle";
            rules.push(theoracleRule);
        }
    }
    if (rules.length === 0) {
        modals.popupErrorModal("displayRulesTable Error!", "displayRulesTable failed to parse any rules!")
        return;
    }
    console.log("rules", rules);

    let header = `<h3>Fetched rules <span id='${modalId}-header-${TABLE_FILTER_COUNT}'</span></h3>`;
    let bodyTop = "";
    let bodyMiddle = "";
    let footer = "Tip: Click any row to load its corresponding rule.";
    let tableId = RULES_TABLE;
    let headerContentMaps = makeRuleTableRows(rules);

    // Filter/Search input text box:
    let filterRadioClassName = `${tableId}-${TABLE_FILTER_RADIO_CLASS_SUFFIX}`;
    let filterRadioId = filterRadioClassName;
    let filterInputId = `${tableId}-${TABLE_FILTER_INPUT_SUFFIX}`;

    bodyTop += `<input type="text" id="${filterInputId}" placeholder="Filter table..">`;

    // Checkboxes:
    let radioHTML = "";
    let columns = Object.keys(headerContentMaps[0]);
    for (let i = 0; i < columns.length; i++) {
        let style = "";
        let column = columns[i];

        // Encountered header is a HTML comment, attempt to extract its hidden friendly name.
        if ( containsHtmlComment(column) ) {
            column = getHtmlCommentData(column);
        }

        // Skip radios if told to.
        if (hideRadios) {
            if (hideRadios.includes(column)) {
                console.log(`Hide added radio button: ${column}`);
                style += "display: none;"
            }
        }

        // Ignore empty keys (If they have no name, they were probably not meant to be automatically added like this).
        if (column !== "" && column !== null) {
            let checked = "";

            // Set checked property if column matched the defaultCheckedRadio (and defaultCheckedRadio is defined).
            if (defaultCheckedRadio) {
                checked = column === defaultCheckedRadio ? " checked": "";
            }

            // Make styles applicable if any are defined.
            if (style !== "") {
                style = `style="${style}"`;
            }

            radioHTML +=
                `<input type="radio" name="${filterRadioClassName}" class="form-check-input" ` +
                `id="${filterRadioId}-${i}" title="${column}" ${checked}${style}>\n` +
                `<label class="form-check-label" for="${filterRadioId}-${i}" ${style}>${column}</label>\n`;
        }
    }

    // Assemble checkboxes HTML.
    bodyTop +=
        `<div class="${filterRadioClassName} form-check form-check-inline" id="${filterRadioId}">\n` +
        `${radioHTML}\n</div>`;
    bodyTop += "<br>";

    // Table:
    let table = makeTable(tableId, headerContentMaps);
    let tableContainer =
        `<div id=${CUSTOM_TABLE_CONTAINER}>\n` +
        `    ${table}\n` +
        `</div>\n`;
    bodyMiddle += tableContainer;

    let modal = modals.popupModal(modals.RESPONSE_MODAL, header, bodyTop, bodyMiddle, null, footer, levels.INFO);

    // Apply actions to modal and table that couldn't be applied before it was spawned:

    // Set size to fullwidth due to the amount of columns of this particular table.
    modal.getElementsByClassName(modals.MODAL_CONTENT_CLASS)[0].classList.add(SIZE_FULLWIDTH_CLASS);

    // Add onkeyup action for filtering results.
    document.getElementById(filterInputId).addEventListener('keyup', function() {
        filterFetchedRules(filterInputId, tableId, filterRadioId, filterCountCallback);
    });

    // Add onclick action for sorting headers.
    for ( let headerElem of document.getElementById(`${tableId}-headers`).children ) {
        headerElem.onclick = function () {
            let table = document.getElementById(tableId);
            while(table.tagName.toUpperCase() !== 'TABLE') table = table.parentNode;
            Array.prototype.slice.call(table.querySelectorAll('tr:nth-child(n+2)'))
                .sort(comparer(Array.prototype.slice.call(headerElem.parentNode.children).indexOf(headerElem), this.asc = !this.asc))
                .forEach(function(tr) {
                    // noinspection JSCheckFunctionSignatures
                    table.appendChild(tr) });
        }
    }

    for (let i = 0; i < rules.length; i++) {
        // Add pending bar to rules that have never been designed.
        if (rules[i]["pending"] === true) {
            document.getElementById(`${tableId}-row-${i}-col-0`).style.backgroundColor = "#f4d03f";
        }

        // Add onclick action for each row to load the corresponding rule.
        document.getElementById(`${tableId}-row-${i}`).onclick = function() {
            // Determine loader based on rule kind (where it stems from)
            let loader = function() {modals.popupErrorModal("<h2>ERROR</h2>", "Loader func is unset!")};
            let loaderParam = null;
            if (rules[i].kind === RULE_KIND_DB) {
                loader = ruleKindDBLoader;
                loaderParam = rules[i]["thehive_case_id"];
            } else if (rules[i].kind === RULE_KIND_THEORACLE) {
                loader = ruleKindTheOracleLoader;
                loaderParam = rules[i]["source_filename"];
            }

            // If editor isn't empty, prompt for confirmation to avoid possible work loss.
            if (getEditorContents().length > 0 && loaderMode === "replace") {
                modals.popupConfirmationModal(
                    [
                        { "action": loader, "args": [loaderParam] },
                        { "action": modals.closeModals } // Close modal after loading the rule.
                    ],
                    null,
                    "<h3>You currently have contents in the editor, loading a rule clears the editor.</h3>")
            } else {
                console.log("rules[i]", rules[i]);
                console.log("Loading rule..", loader, loaderParam);
                loader(loaderParam);

                // Close modal after loading the rule.
                modals.closeModals();
            }
        };

        // Set pointer cursor in each row to indicate onclick presence.
        document.getElementById(`${tableId}-row-${i}`).style.cursor = "pointer";
    }
}