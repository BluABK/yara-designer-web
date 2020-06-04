import { md5 } from './third-party/md5.js';
import * as levels from "./modules/levels.js";
import { NoContentsException, NO_CONTENTS_EXCEPTION } from "./modules/exceptions.js";
import { getParameterByName } from "./modules/utils.js";
import * as modals from "./modules/modals.js";
import * as yara from "./modules/yara.js";

console.log(yara);

try {
    let ys1 = yara.createYARAString('my_Identifier5', "This is a string", yara.YARA_TYPE_TEXT, [yara.YARA_MODIFIER_WIDE, yara.YARA_MODIFIER_NO_CASE]);

    console.log("ys1", ys1);
} catch (e) {
    console.error(e);
}

try {
    let ys2 = yara.createYARAString('my_Identifier5', "This is a string", yara.YARA_TYPE_TEXT, [yara.YARA_MODIFIER_WIDE, yara.YARA_MODIFIER_NO_CASE, yara.YARA_MODIFIER_BASE64]);

    console.log("ys2", ys2);
} catch (e) {
    console.log("Caught Expected YS2 Exception ", e);
}

// MIME Types:
const MIMETYPE_JSON = 'application/json';

// Root:
const ROOT_CLASS = 'yara-rule-designer';

// Modifying classes
const SIZE_WIDE_CLASS = "size-wide";
const SIZE_FULLWIDTH_CLASS = "size-fullwidth";

// Tables:
const CUSTOM_TABLE_CLASS = "custom-table";
const CUSTOM_TABLE_CONTAINER = `${CUSTOM_TABLE_CLASS}-container`;
const TABLE_FILTER_INPUT_SUFFIX = "input-filter";
const TABLE_FILTER_RADIO_CLASS_SUFFIX = `${TABLE_FILTER_INPUT_SUFFIX}-radios`;
const TABLE_FILTER_COUNT = "filter-count";
const TABLE_FILTER_CHECKED_RADIO = "Title";
const TABLE_FILTER_HIDDEN_RADIOS = ["Pending"];

// Table: -- Fetched Rules
const RULES_TABLE = "fetched-rules";

// Designer:
const HTML_TITLE = `${ROOT_CLASS}-title`;
const DESIGNER_HEADER = `${ROOT_CLASS}-header`;
const DESIGNER_HEADER_CONTENT = `${DESIGNER_HEADER}-content`;
const DESIGNER_HEADER_CONTENT_TITLE = `${DESIGNER_HEADER_CONTENT}-title`;
const DESIGNER_HEADER_CONTENT_BYLINE = `${DESIGNER_HEADER_CONTENT}-byline`;
const DESIGNER_HEADER_CONTENT_DESCRIPTION = `${DESIGNER_HEADER_CONTENT}-description`;

const DESIGNER_TAGS = `${ROOT_CLASS}-tags`;
const DESIGNER_TAGS_CHECKBOX_CLASS = "yara-tag-checkbox";
const OPERATOR_CONTAINER = `${ROOT_CLASS}-operators`;
const OBSERVABLE_DATA = `observable-data`;
const OBSERVABLE_DATA_CLASS = `condition-observable-data`;
const OBSERVABLE_DATA_CONTAINER = `${ROOT_CLASS}-observable-data`;
const OBSERVABLE_TYPE = `observable-type`;
const OBSERVABLE_TYPE_CLASS = `condition-observable-type`;
const OBSERVABLE_TYPE_CONTAINER = `${ROOT_CLASS}-observable-types`;
const LEFTPANE_DRAGGABLES = [OPERATOR_CONTAINER, OBSERVABLE_TYPE_CONTAINER, OBSERVABLE_DATA_CONTAINER];
const OBSERVABLE_YARA_DATA_JSON = "data-yara-string-json";
const YARA_STRING_TYPE_CLASS_TEXT = "yara-string-type-text";
const YARA_STRING_TYPE_CLASS_HEX = "yara-string-type-hex";
const YARA_STRING_TYPE_CLASS_REGEX = "yara-string-type-regex";

const DESIGNER_EDITOR = `${ROOT_CLASS}-editor`;

// Text and styling:
const NUMBERED_TEXTBOX_CLASS = "numbered-lines";
const SUCCESS_ICON = "<span style='color: green'>&#10003;</color>";
const FAILED_ICON = "<span style='color: red'>&#10005;</span>";
const BGCOLOR_RED_CLASS = "red-bg";
const TEXT_COLOR_GREEN_CLASS = "green-text";
const TEXT_COLOR_RED_CLASS = "red-text";
const YARA_VARIABLE_DENOMINATOR = "$";

// Convenience/readability constants:
const MOUSE_CLICK_LEFT = 0;
const MOUSE_CLICK_MIDDLE = 1;
const MOUSE_CLICK_RIGHT = 2;
const OBSERVABLE_CLASSES = ["condition-observable-data", "condition-observable-type"];
const KEYWORD_CLASSES = ["condition-keyword"];
const SYNTAX_ERROR = "syntax";

// Add event listeners.
// -- Buttons:
document.querySelector('#load-rule-button').addEventListener('click', loadRuleDialog);
document.querySelector('#show-help-button').addEventListener('click', modals.popupHelpModal);
document.querySelector('#clear-rule-button').addEventListener('click', clearRule);
document.querySelector('#submit-rule-button').addEventListener('click', postRule);

// -- Draggables:
// -- -- Operators
// -- -- -- Boolean:
document.querySelector('#condition-keyword-and').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-or').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-not').addEventListener('click', function(){ addToEditor(event) });
// -- -- -- Arithmetic:
document.querySelector('#condition-keyword-equal').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-lt').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-gt').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-leq').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-geq').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-neq').addEventListener('click', function(){ addToEditor(event) });
// -- -- -- Relational:
document.querySelector('#condition-keyword-add').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-sub').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-mul').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-div').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-pct').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-setminus').addEventListener('click', function(){ addToEditor(event) });
// -- -- -- Bitwise:
document.querySelector('#condition-keyword-bitwise-and').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-bitwise-or').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-bitwise-not').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-bitwise-xor').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-bitwise-lshift').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-bitwise-rshift').addEventListener('click', function(){ addToEditor(event) });
// -- -- -- Parenthesis and wrappers:
document.querySelector('#condition-keyword-lparen').addEventListener('click', function(){ addToEditor(event) });
document.querySelector('#condition-keyword-rparen').addEventListener('click', function(){ addToEditor(event) });
// -- -- -- Encapsulators:
document.querySelector('#condition-keyword-encapsulate-paren').addEventListener('click', function(){ addToEditor(event) });

/**
 * Add a MD5 sum property to String prototype which returns the MD5 sum of its value.
 * */
Object.defineProperty(String.prototype, 'md5sum', {
    value: function() {
        return md5(this);
  }
});

// NB: *NOT* Unused and needs to be var (instead of let/const) due to being a GLOBAL.
var currentlyLoadedRule = null;

/////////////////////////////////// Dragula - drag 'n Drop //////////////////////////////////////////
dragula([
    // Enable drag and drop for these DIVs:
    document.getElementById(OPERATOR_CONTAINER),
    document.getElementById(OBSERVABLE_TYPE_CONTAINER),
    document.getElementById(OBSERVABLE_DATA_CONTAINER),
    document.getElementById(DESIGNER_EDITOR)
], { // Apply logic.
    copy: function (el, source) {
        // If the source is one of the draggable elements, allow copy.
        return LEFTPANE_DRAGGABLES.includes(source.id);
    },

    accepts: function (el, target) {
        // If the target is NOT one of the draggable elements, accept drop.
        return !LEFTPANE_DRAGGABLES.includes(target.id);
    }
});

///////////////////////////////////// Core (designer) code ///////////////////////////////////
/**
 * Logs the selected item and pops up a modal with the inner HTML.
 * @param target
 */
function debugSelectedTarget(target) {
    console.log("debugSelectedTarget", target);
    modals.popupModal(modals.RESPONSE_MODAL, target, target.innerHTML);
}

/**
 * Disable default context menu.
 *
 * @returns {boolean}
 */
if (document.addEventListener) {
    document.addEventListener('contextmenu', function(mouseEvent) {
        console.log('contextmenu', mouseEvent);

        let posX = mouseEvent.clientX;
        let posY = mouseEvent.clientY;
        customContextMenuShow(mouseEvent, posX, posY);
        mouseEvent.preventDefault();
    }, false);
    document.addEventListener('click', function(mouseEvent) {
        // console.log('click', mouseEvent);

        let customContextMenuElement = document.getElementById("custom-context-menu");
        customContextMenuElement.style.opacity = "0";
        setTimeout(function() {
            customContextMenuElement.style.visibility = "hidden";
        }, 501);
    }, false);
} else {
    document.attachEvent('oncontextmenu', function(e) {
        console.log('oncontextmenu', e);

        let posX = e.clientX;
        let posY = e.clientY;
        customContextMenuShow(e, posX, posY);
        e.preventDefault();
    });
    document.attachEvent('onclick', function(e) {
        console.log('onclick', e);

        let customContextMenuElement = document.getElementById("custom-context-menu");
        customContextMenuElement.style.opacity = "0";
        setTimeout(function() {
            customContextMenuElement.style.visibility = "hidden";
        }, 501);
    });
}

function clearContextMenu() {
    let customContextMenuElement = document.getElementById("custom-context-menu");
    customContextMenuElement.innerHTML = "";
}

function editorContextMenu() {
    let customContextMenuElement = document.getElementById("custom-context-menu");

}

function LeftpaneContextMenu() {
    let customContextMenuElement = document.getElementById("custom-context-menu");

}

function defaultContextMenu(e) {
    console.log("defaultContextMenu", e);

    let customContextMenuElement = document.getElementById("custom-context-menu");
    customContextMenuElement.innerHTML =
        `<p id="debug-selected-item-option">Debug target: ${e.target.localName}#${e.target.id}.${e.target.className}</p>` +
        `<a href="#" id="debug-selected-item-option">Debug target a</a>`;

    document.querySelector('#debug-selected-item-option').addEventListener('click', function(){ debugSelectedTarget(e.target) });
}

function customContextMenuShow(e, x, y) {
    console.log("customContextMenuShow", e, x, y);

    let customContextMenuElement = document.getElementById("custom-context-menu");

    clearContextMenu();

    defaultContextMenu(e);

    // Show the context menu.
    customContextMenuElement.style.top = y + "px";
    customContextMenuElement.style.left = x + "px";
    customContextMenuElement.style.visibility = "visible";
    customContextMenuElement.style.opacity = "1";
}


// function customContextMenu(clickEvent) {
//     let editorDiv = document.getElementById(DESIGNER_EDITOR);
//
//     // Only perform remove action if target is a child of editor div.
//     if (clickEvent.target.parentNode.getAttribute("id") === DESIGNER_EDITOR) {
//         editorContextMenu();
//         // console.log("removeFromEditor", clickEvent.target);
//         // editorDiv.removeChild(clickEvent.target);
//     }
// }
/**
 * Override default behaviour for mouse clicks in the editor div,
 * in order to support middle and right clicks.
 */
document.getElementById(DESIGNER_EDITOR).addEventListener("auxclick", function(ev) {
  // Prevent default action in order to implement our own.
  ev.preventDefault();

  // Handle aux click events.
  onAuxClick(ev);
});

function addToEditor(clickEvent) {
    let editorDiv = document.getElementById(DESIGNER_EDITOR);

    // If target is already in the editor, ignore the click event.
    if (clickEvent.target.parentNode.getAttribute("id") === DESIGNER_EDITOR) {
        console.log("Ignored click event (target is child of editor div)", clickEvent);

        return
    }

    console.log('addToEditor', clickEvent.target);
    editorDiv.appendChild(makeClone(clickEvent.target));
}

function removeFromEditor(clickEvent) {
    let editorDiv = document.getElementById(DESIGNER_EDITOR);

    // Only perform remove action if target is a child of editor div.
    if (clickEvent.target.parentNode.getAttribute("id") === DESIGNER_EDITOR) {
        console.log("removeFromEditor", clickEvent.target);
        editorDiv.removeChild(clickEvent.target);
    }
}


function onAuxClick(auxClickEvent) {
    console.log("onAuxClick", auxClickEvent);

    // Check which mouse button was pressed and act accordingly.
    switch (auxClickEvent.button) {
        case MOUSE_CLICK_MIDDLE:
            removeFromEditor(auxClickEvent);
            break;
        case MOUSE_CLICK_RIGHT:
            break;
    }
}

function getEditorContents() {
    return document.getElementById(DESIGNER_EDITOR).children;
}

function getEditorObservables(unique=true) {
    let observables = [];
    let children = getEditorContents();
    if (children.length === 0) {
        throw new NoContentsException("Editor had no contents");
    }

    for (let i = 0; i < children.length; i++) {
        if ( OBSERVABLE_CLASSES.includes(children[i].className) ) {
            if (unique === true) {
                // If unique is specified, omit duplicate entries.
                if ( !observables.some(child => child.id === children[i].id) ) {
                    observables.push(children[i]);
                }
            } else {
                observables.push(children[i]);
            }
        }
    }

    return observables;
}

function getEditorElementObservableText(element) {
    // Get text string.
    return $(element).text();
}

function getEditorElementObservableType(element) {
    // Get text string.
    return $(element).getAttribute(YARA_STRING_TYPE_ATTR);
}

function getEditorElementKeywordText(element) {
    // Get text string.
    return $(element).text();
}

function getEditorConditionString() {
    let conditionString = "";
    let children = getEditorContents();

    // Spacing to use in front of a word, to form a coherent sentence structure.
    let preSpacing = "";
    for (let i = 0; i < children.length; i++) {
        if (i === 1) {
            // If we're past the first entry we can start prepending spacing.
            preSpacing = " ";
        }

        // If child is of the observable family.
        if ( OBSERVABLE_CLASSES.includes(children[i].className) ) {
            // Prepend with a YARA variable denominator.
            conditionString += preSpacing + YARA_VARIABLE_DENOMINATOR + children[i].id;
        } else if (KEYWORD_CLASSES.includes(children[i].className)) {
            // Child is a logical operator
            conditionString += preSpacing + getEditorElementKeywordText(children[i]).toLowerCase();
        } else {
            console.error("getEditorConditionString is not supposed to reach an else condition!", children[i]);
        }
    }

    return conditionString;
}

function getEnabledTags() {
    let enabledTags= [];
    let tagCheckboxes = document.getElementsByClassName(DESIGNER_TAGS_CHECKBOX_CLASS);

    for (let i = 0; i < tagCheckboxes.length; i++) {
        if (tagCheckboxes[i].checked) enabledTags.push(tagCheckboxes[i].value);
    }

    return enabledTags;
}

/**
 * Generate a JSON of varname and vardata to send in POST request.
 *
 * JSON template: { "meta": {...}, "rule": str, "tags": list, "observables": {...}, "condition": str }
 */
function getRuleJsonFromEditorElements() {
    let json = {};
    let yaraRule = window.currentlyLoadedRule;
    let yaraRuleName = `Whitelist_${yaraRule.data.title}`; // FIXME: Hardcoded string variable should be made configurable.
    let yaraMetaDescription = `Whitelist regler for alarmen: Whitelist_${yaraRule.data.title}`; // FIXME: Hardcoded string variable should be made configurable.

    // Set meta FIXME: sub-dicts hardcoded!
    json["meta"] = {"description" : yaraMetaDescription};

    // Set rule name.
    json["rule"] = yaraRuleName;

    // Set tags.
    json["tags"] = getEnabledTags();

    // Get list of observables currently residing in editor DIV.
    json["observables"] = {};

    let observables = getEditorObservables();
    for (let i = 0; i < observables.length; i++) {
        json["observables"][YARA_VARIABLE_DENOMINATOR + observables[i].id] = {
            "observable": getEditorElementObservableText(observables[i])
        }
    }

    // Get condition.
    json["condition"] = getEditorConditionString();

    return json;
}

function fetchGetRequest(url, callback) {
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    function json(response) {
        return response.json()
    }

    fetch(url)
    .then(status)
    .then(json)
    .then(function(data) {
        // console.log(`fetchRequest succeeded with JSON response`, data);
        callback(data);
      }).catch(function(error) {
        console.log('fetchRequest failed!', error);
      });
}

async function fetchPostRequest(url = '', data = {}, callback) {
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    function json(response) {
        return response.json()
    }

    // Default options are marked with *
    await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': MIMETYPE_JSON
          // 'Content-Type': MIMETYPE_URL_ENCODED',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        .then(status)
        .then(json)
        .then(function(data) {
            console.log(`fetchPostRequest succeeded with JSON response`, data);
            callback(data);
          }).catch(function(error) {
            console.log('Request failed', error);
          });
}


function getRule(ruleId, callback=printRulesTable) {
    // noinspection JSIgnoredPromiseFromCall
    fetchGetRequest(`${GET_RULE_ROUTE}/${ruleId}`, callback);
}

function getRules(callback=printRulesTable) {
    fetchGetRequest(GET_RULES_ROUTE, callback);
}

/**
 * Generates a (nicely formatted/indented) HTML <TABLE> based on a list of header:column maps.
 *
 * @param id                    (Unique) ID for <TABLE>.
 * @param headerContentMaps     List of header:column maps (e.g. [{"title": "a title}].
 * @param className             (Unique) class name for <TABLE>.
 *
 * @returns {string}            Generated HTML <TABLE>.
 */
function makeTable(id, headerContentMaps, className = CUSTOM_TABLE_CLASS) {
    // Header row:
    let headerColumns = "";
    // For key in arbitrary JSON (they all share the same keys).
    for (let key of Object.keys(headerContentMaps[0])) {
        let friendlyName = key;

        // Encountered header is a HTML comment, attempt to extract its hidden friendly name.
        if ( containsHtmlComment(friendlyName) ) {
            friendlyName = getHtmlCommentData(friendlyName);
        }

        headerColumns += `        <th id="${id}-header-${friendlyName}">${key}</th>\n`;
    }

    let headerRow =
        `    <tr id="${id}-headers" class='header ${className}-header'>\n` +
        `${headerColumns}` +
        `    </tr>`;

    // Content rows:
    let tableContents = "";
    // For JSON in list.
    for (let i = 0; i < headerContentMaps.length; i++) {
        let item = headerContentMaps[i];
        tableContents += `    <tr id="${id}-row-${i}">\n`;

        // For item in JSON.
        let keys = Object.keys(item);
        for (let key of keys) {
            let keyIndex = Object.keys(item).indexOf(key);
            tableContents += `        <td id="${id}-row-${i}-col-${keyIndex}">${item[key]}</td>\n`;
        }
        tableContents +=
            `    </tr>\n`;
    }

    return `<table id="${id}" class="${className}">\n` +
            `${headerRow}\n` +
            `${tableContents}` +
            `</table>`;
}

/**
 * Makes a ISO8601 datetime string more human readable.
 *
 * @param isoDateString     "YYYY-MM-DDTHH:MM:SS.f"
 * @returns {string}        "YYYY-MM-DD HH:MM:SS"
 */
function humanizeISODate(isoDateString) {
    let date = isoDateString.split('T')[0];
    let time = isoDateString.split('T')[1].split('.')[0];

    return `${date} ${time}`;
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
        return typeof obj[Symbol.iterator] === 'function';
}

function makeRuleTableRows(rules) {
    let headerContentMaps = [];

    if (isIterable(rules) !== true) {
        rules = Array(rules);
    }

    for (let rule of rules) {
        headerContentMaps.push({
            "<!--Pending-->": "",  // Value intentionally left blank (to be filled with pending bar later).
            "Title": rule.data.title,
            "Sev": rule.data.severity,
            "<!--Observables--><img src='/static/images/searchicon.png' title='Observables'>": rule.data.observables.length,
            "Added": rule.added_on !== null ? humanizeISODate(rule.added_on) : "N/A",
            "YARA File": rule["yara_filename"] !== undefined ? rule["yara_filename"] : "N/A",
            "Modified": rule.last_modified !== null ? humanizeISODate(rule.last_modified): "N/A",
            "ID": rule.data.id
        });
    }

    return headerContentMaps;
}

function filterFetchedRules(inputId, tableId, filterRadioId, filterCountCallback=null) {
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

// noinspection JSUnusedLocalSymbols
/**
 * Takes a string and returns a boolean of whether it's a HTML comment.
 *
 * @param s
 */
function isHtmlComment(s) {
    return ( s.startsWith("<!--") && s.endsWith("-->") );
}

/**
 * Takes a string and returns a boolean of whether contains a HTML comment.
 *
 * @param s
 */
function containsHtmlComment(s) {
    const regex = /<!--.*-->/g;
    return s.search(regex) !== -1;
}

/**
 * Takes a string and returns the substring in-between the HTML comment delimiters.
 *
 * @param s
 */
function getHtmlCommentData(s) {
    const regex = /<!--(.*)-->/;

    // Return the second item which is the 1st capturing group,
    // (the first group entry is the complete match).
    return s.match(regex)[1].toString();
}

function filterCountCallback(filterCount, modalId = modals.RESPONSE_MODAL) {
    let filtercountElement = document.getElementById(
        `${modalId}-${modals.MODAL_HEADER}-${TABLE_FILTER_COUNT}`);

    filtercountElement.innerText = filterCount > 0 ? `(filtered: ${filterCount})` : "";
}

function getCellValue(tr, idx) {
    return tr.children[idx].innerText || tr.children[idx].textContent;
}


function comparer(idx, asc) {
    return function(a, b) { return function(v1, v2) {
        return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
    }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
}}

function mockRules(num) { // FIXME: Remove this debug/testing function.
    let mockRules = [];
    for (let i = 0; i < num; i++) {
        mockRules.push({
            "added_on": "2020-03-05T13:50:07.793123",
            "case_id": String(i),
            "data": {
                "title": `Mock Rule #${i}`,
                "severity": i,
                "observables": [],
                "id": String(i)
            },
            "last_modified": "2020-04-29T10:28:28.504976",
            "pending": true,
            "yara_file": null
        })
    }
    return mockRules;
}

/**
 * Print fetched rules table.
 *
 * Customised printTable code for fetched rules.
 *
 * @param rules
 * @param defaultCheckedRadio
 * @param hideRadios
 * @param modalId
 */
function printRulesTable(rules, defaultCheckedRadio = TABLE_FILTER_CHECKED_RADIO,
                         hideRadios = TABLE_FILTER_HIDDEN_RADIOS, modalId = modals.RESPONSE_MODAL) {
    console.log("rules", rules);
    // console.log("mock rules", mockRules(5));
    // for ( let mockRule of mockRules(50) ) {
    //     rules.push(mockRule);
    // }

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
    // console.log(body);

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
            // If editor isn't empty, prompt for confirmation to avoid possible work loss.
            if (getEditorContents().length > 0) {
                modals.popupConfirmationModal({"action": loadRule, "args": [rules[i].data.id]}, null,
                    "<h3>You currently have contents in the editor, loading a rule clears the editor.</h3>")
            } else {
                loadRule(rules[i].data.id);
                document.getElementById(modals.RESPONSE_MODAL_FOOTER).innerText =
                    `Loaded rule: ${rules[i].data.title} [ID: ${rules[i].data.id}]`;
            }
        };

        // Set pointer cursor in each row to indicate onclick presence.
        document.getElementById(`${tableId}-row-${i}`).style.cursor = "pointer";
    }
}

function loadRuleDialog() {
    getRules();
}

function setTitle(title, id, description=null) {
    document.getElementById(HTML_TITLE).innerText = title;
    document.getElementById(DESIGNER_HEADER_CONTENT_TITLE).innerHTML =
        `<p> Case: ${title}</p>`;
    document.getElementById(DESIGNER_HEADER_CONTENT_BYLINE).innerHTML =
        `<p>ID: ${id}</p>`;
    document.getElementById(DESIGNER_HEADER_CONTENT_DESCRIPTION).innerHTML =
        `<p>${description}</p>`;
}

function setTags(tags) {
    let html ="";
    for (let i = 0; i < tags.length; i++) {
        html += `<input type="checkbox" id="tagCheckbox${i}" class="${DESIGNER_TAGS_CHECKBOX_CLASS}" ` +
            `value="${tags[i]}">\n` +
            `<label for="tagCheckbox${i}" title="${tags[i]}">${tags[i]}</label>\n`;
            `<div class="w-100"></div>\n`;
    }
    document.getElementById(DESIGNER_TAGS).innerHTML = html;
}

/**
 * Clears an element by setting its innerHTML to "".
 *
 * @param elementID
 */
function clearElement(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

/**
 * Takes a list of observable data entries, then creates and attaches
 * a YARAString object to them and finally adds them to a given container.
 *
 * If a YARAString cannot be produced from an observable an error is raised and the item is skipped.
 *
 * @param observables               A list of observables with at least fields 'data' and 'dataType'.
 * @param idPrefix                  Prefix string for each observable ID field.
 * @param classBaseName             The base (primary) name of the class to group the observables into.
 * @param observableContainer       Container element to add observables to.
 * @param defaultStringType         The default string type.
 * @param forceDefaultStringType    Disable string type check, setting it equal to default.
 */
function addObservables(observables, idPrefix, classBaseName, observableContainer,
                        defaultStringType = yara.YARA_TYPE_TEXT,
                        forceDefaultStringType = false) {
    for (let i = 0; i < observables.length; i++) {
        let observable = document.createElement("span") ;

        let data = observables[i].data;
        let dataType = observables[i].dataType;

        let identifier = yara.sanitizeIdentifier(`${idPrefix}-${data.md5sum()}`);

        let stringType = defaultStringType;
        if (!forceDefaultStringType) {
            // Determine string type based on observable's dataType property.
            if (dataType === "regexp") {
                stringType = yara.YARA_TYPE_REGEX;
            } else {
                // Try to determine data type based on data string.
                if (data.match(yara.YARA_HEX_REGEX)) {
                    stringType = yara.YARA_TYPE_HEX;
                }
            }
        }

        try {
            // Make sure data can be transformed into a valid YARA String (throws exception if not).
            let ys = yara.createYARAString(identifier, data, stringType, []);

            // Set necessary attributes.
            observable.setAttribute("id", identifier);
            observable.setAttribute("class", classBaseName);

            // Set representative text (what user sees).
            observable.textContent = `${stringType}: ${data}`;

            // Append corresponding string type class to classList.
            switch (stringType) {
                case yara.YARA_TYPE_TEXT:
                    observable.classList.add(YARA_STRING_TYPE_CLASS_TEXT);
                    break;
                case yara.YARA_TYPE_HEX:
                    observable.classList.add(YARA_STRING_TYPE_CLASS_HEX);
                    break;
                case yara.YARA_TYPE_REGEX:
                    observable.classList.add(YARA_STRING_TYPE_CLASS_REGEX);
                    break;
                default:
                    let acceptedStr = yara.YARA_TYPES.join(',');
                    console.error(`stringType has unexpected type! '${stringType}' is not one of: [${acceptedStr}].`);
                    break;
            }

            // Set YARA specific properties (for use in computation):
            let yaraJSON = {
                "identifier": ys.getIdentifier(),
                "value": ys.getValue(),
                "type": ys.getType(),
                "modifiers": ys.getModifiers(),
                "text": ys.text()
            };

            observable.setAttribute(OBSERVABLE_YARA_DATA_JSON, JSON.stringify(yaraJSON));

            // Make observable element clickable.
            observable.addEventListener('click', function(){ addToEditor(event) });

            console.log("observable SPAN", observable);

            // Append observable (DOM Element) to observables container (DOM element).
            document.getElementById(observableContainer).appendChild(observable);
        } catch (e) {
            console.exception(
                `Caught exception while attempting to create YARA String from '${data}', skipping!`, e);
        }
    }
}

/**
 * Clears observable containers and then adds observables to them.
 *
 * @param observables A list of observable Objects with at least fields 'data' and 'dataType'.
 */
function setAllObservables(observables) {
    let uniqueTypes = [];
    let uniqueObservables = [];

    for (let observable of observables) {
        // Ensure 'dataType' field exists.
        if (observable.hasOwnProperty("dataType")) {
            // Create a new observable object in order to make some non-destructive changes.
            let modifiedObservable = Object.assign({}, observable);

            // Set data equal to dataType so that type obj are added with the type as value not its original data.
            modifiedObservable.data = modifiedObservable.dataType;

            // Object isn't already in the list.
            if (!uniqueTypes.some(obs => obs.dataType === modifiedObservable.dataType)) {
                // Append to list.
                uniqueTypes.push(modifiedObservable);
            }
        }

        // Ensure 'data' field exists.
        if (observable.hasOwnProperty("data")) {
            // Object isn't already in the list.
            if (!uniqueObservables.some(obs => obs.data === observable.data)) {
                // Append to list.
                uniqueObservables.push(observable);
            }
        }
    }

    // Clear any existing observables (leftover from a previously loaded rule)
    clearElement(OBSERVABLE_TYPE_CONTAINER);
    clearElement(OBSERVABLE_DATA_CONTAINER);

    // Add new observables.
    addObservables(uniqueTypes, OBSERVABLE_TYPE, OBSERVABLE_TYPE_CLASS, OBSERVABLE_TYPE_CONTAINER, yara.YARA_TYPE_TEXT, true);
    addObservables(uniqueObservables, OBSERVABLE_DATA, OBSERVABLE_DATA_CLASS, OBSERVABLE_DATA_CONTAINER)
}

function loadRuleCallback(rule) {
    // Clear editor.
    clearEditorDivContents();

    // Set the currently loaded rule global variable (used in other functions).
    window.currentlyLoadedRule = rule;

    // Set title tag and title div.
    setTitle(rule.data.title, rule.data.id, rule.data.description);

    // Set tags div.
    setTags(rule.data.tags);

    // Set observables divs.
    setAllObservables(rule.data.observables);
}

function loadRule(ruleId) {
    getRule(ruleId, loadRuleCallback);
}

function makeCollapsibleJSONDetails(json, id) {
    return `<button type="button" class="${modals.RESPONSE_MODAL_BUTTON_JSON_COLLAPSIBLE_CLASS}"\n` +
           `                      data-toggle="collapse" data-target="#${id}"\n` +
           `                      aria-expanded="false" aria-controls="${id}">\n` +
           `     Show JSON\n` +
           `</button>` +

           `<div id="${id}" class="collapse">` +
           `   <div class='${modals.RESPONSE_MODAL_JSON_COLLAPSIBLE_CONTENT_CLASS}'>` +
           // `<div>` +
           `       <pre>` +
           `           ${JSON.stringify(json, undefined, 4)}` +
           `       </pre>` +
           `   </div>` +
           `</div>`;
}

function handlePostRuleResponse(json) {
    let errorType = "";
    let errorMessage = "";
    let errorLineNumber = 0;
    let errorColumnNumber = 0;
    let errorColumnRange = 0;
    let errorWord = "";
    let level = "success";

    // Parse JSON:
    let outJson = json["out"];

    let compilable = outJson["compilable"];
    let success = outJson["success"];

    let source = outJson["source"];

    let yaraRuleSourceFile = outJson["generated_yara_source_file"];

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

        console.log("errorMessage: " + errorMessage);
        console.log("errorType: " + errorType);
        console.log("errorLineNumber: " + errorLineNumber);
        console.log("errorColumnNumber: " + errorColumnNumber);
        console.log("errorColumnRange: " + errorColumnRange);
        console.log("errorWord: " + errorWord);
        console.log("level: " + level);
    }

    // Define header
    let header = `<h2>YARA rule generation results: ${String(level).toUpperCase()}</h2>`;

    // Define body
    let body = "";

    // Passed/Failed items.
    body += "<p>" + (compilable === true ? SUCCESS_ICON : FAILED_ICON) + " Compiles </p>";

    // Error message (if any).
    if (!success) {
        body += `<p>${errorType.replace(/^\w/, c => c.toUpperCase())} error message: ${errorMessage}</p>`;
    }

    // Formatted string of the generated YARA rule ("source").
    body += "<br/>Generated YARA rule:<br/>";

    // Loop through lines to add line numbering support via CSS counter.
    let lines = String(source).split('\n');
    body += `<pre class='${NUMBERED_TEXTBOX_CLASS}'>`;
    for (let i = 0; i < lines.length; i++) {
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

        // Append line
        body += `<span>${lines[i]}</span>`;
    }
    body += "</pre>";

    // Add commit button if valid result.
    if (success) {
        body += `<button id="${modals.RESPONSE_MODAL_BUTTON_COMMIT}" class="${modals.RESPONSE_MODAL_BUTTON_COMMIT_CLASS}">Commit & Push</button>`;
    } else {
        body += `<button id="${modals.RESPONSE_MODAL_BUTTON_COMMIT}" class="${modals.RESPONSE_MODAL_BUTTON_COMMIT_DISABLED_CLASS}" disabled>Commit & Push</button>`;
    }

    // Collapsible raw JSON details.
    body += makeCollapsibleJSONDetails(json, 'collapsible-json-details-post-rule');

    // Spawn modal.
    modals.popupModal(modals.RESPONSE_MODAL, header, null, body, null, modals.MODAL_DEFAULT_FOOTER, level);

    // Perform changes that requires a spawned modal:

    // Add bindings to buttons.
    document.getElementById(modals.RESPONSE_MODAL_BUTTON_COMMIT).onclick = function() {
        // Perform bound action.
        let jsonToCommit = {};
        let yaraRule = window.currentlyLoadedRule;
        jsonToCommit["filepath"] = yaraRuleSourceFile;
        jsonToCommit["rulename"] = json["in"]["rule"]; // FIXME: Make backend send the proper sanitized rulename in "out" dict.
        jsonToCommit["case_id"] = yaraRule.data.id;

        postCommit(jsonToCommit);

        // Close modal after handling button action.
        document.getElementById(modals.CONFIRMATION_MODAL).style.display = "none";
    };
}

/**
 * Make a custom POST request for non-form elements like DIV and SPAN.
 */
function postRule() {
    try {
        let json = getRuleJsonFromEditorElements();

        let xhr = new XMLHttpRequest();  // FIXME: Replace antiquated XHR with fetch.

        console.log("POST URL: " + POST_RULE_ROUTE);

        xhr.open("POST", POST_RULE_ROUTE, true);
        xhr.setRequestHeader('Content-Type', MIMETYPE_JSON);

        // Add custom handling of the response returned by XHR POST URL.
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                handlePostRuleResponse(JSON.parse(xhr.responseText));
            }
        };

        // Convert a JavaScript value to a JavaScript Object Notation (JSON) string (Required for POST).
        xhr.send(JSON.stringify(json));
    } catch (e) {
        if (e.name === NO_CONTENTS_EXCEPTION) {
            console.warn(e.message, e.name);
            modals.popupWarningModal(e.message, "Please add contents to the editor before submitting.");
        } else {
            console.error(e.message, e.name);
            modals.popupErrorModal(e.name, e.message);
        }
    }
}

function printGitLogEntry(hexSha, authorUsername, authorEmail, dateString, msg) {
    return `<span>
                commit ${hexSha}<br/>
                Author: ${authorUsername} &lt;<a href="mailto:${authorEmail}">${authorEmail}</a>&gt;<br/>
                Date: &nbsp;&nbsp; ${dateString}<br/>
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;${msg}
            </span>`;
}

function printGitDiff(diffString, color=true) {
    if (diffString === "") {
        return "<p>There were no differences between this and the previous commit.</p>"
    }

    let retv = `<pre class='${NUMBERED_TEXTBOX_CLASS}'>`;

    if (color) {
        for (let line of diffString.split('\n')) {
            if (line.startsWith("+")) {
                retv += `<span><mark class='${TEXT_COLOR_GREEN_CLASS}'>${line}</mark>\n</span>`
            } else if (line.startsWith("-")) {
                retv += `<span><mark class='${TEXT_COLOR_RED_CLASS}'>${line}</mark>\n</span>`
            }
            else {
                retv += `<span>${line}\n</span>`;
            }
        }
    } else {
        for (let line of diffString.split('\n')) {
            retv += `<span>${line}</span>`
        }
    }
        retv += "</pre>";

    return retv;
}

function handlePostCommitResponse(json) {
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
    modals.popupModal(modals.RESPONSE_MODAL, header, null, body, null, modals.MODAL_DEFAULT_FOOTER, level);
}

/**
 * Make a custom POST request for non-form elements like DIV and SPAN.
 */
function postCommit(json) {
    let xhr = new XMLHttpRequest();  // FIXME: Replace antiquated XHR with fetch.

    console.log("POST URL: " + POST_COMMIT_ROUTE);

    xhr.open("POST", POST_COMMIT_ROUTE, true);
    xhr.setRequestHeader('Content-Type', MIMETYPE_JSON);

    // Add custom handling of the response returned by XHR POST URL.
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // Make sure to close any open modals.
            for ( let modalElement of document.getElementsByClassName(modals.MODAL_CLASS) ) {
                if (modalElement.style.display !== "none") {
                    console.log("[postCommit] xhr.onreadystatechange: Closed open modal: " + modalElement.id);
                    modalElement.style.display = "none";
                }
            }

            // Handle response.
            handlePostCommitResponse(JSON.parse(xhr.responseText));
        }
    };

    // Convert a JavaScript value to a JavaScript Object Notation (JSON) string (Required for POST).
    xhr.send(JSON.stringify(json));
}

function clearEditorDivContents() {
    let editorDiv = document.getElementById(DESIGNER_EDITOR);
    editorDiv.textContent = '';
}

function clearRule() {
    // Define body
    let body = "<h3>Are you sure you want to clear the current rule? This is action is <em>irreversible</em>.</h3>";

    // yesAction, noAction, body, args...
    modals.popupConfirmationModal({"action": clearEditorDivContents}, null, body);
}

function makeClone(node) {
    console.log("makeClone", node);
    let clone;

    // Returns a copy of node. If deep is true, the copy also includes the node's descendants.
    clone = node.cloneNode(true);

    node.parentNode.insertBefore(clone, node);

    return clone;
}

// Global code
let idParm = getParameterByName("id");

if (idParm !== null && idParm !== "") {
    console.log("Load rule: " + idParm);
    loadRule(idParm);
}

// Indicate that script ran through to the end during the initial load.
console.log("Ready.");
