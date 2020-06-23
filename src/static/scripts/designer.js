import {md5} from './third-party/md5.js';
import * as levels from "./modules/levels.js";
import {NO_CONTENTS_EXCEPTION, NoContentsException} from "./modules/exceptions.js";
import {getParameterByName} from "./modules/utils.js";
import * as modals from "./modules/modals.js";
import * as yara from "./modules/yara.js";

// console.log(yara);
//
// try {
//     let ys1 = yara.createYARAString('my_Identifier5', "This is a string", yara.YARA_TYPE_TEXT, [yara.YARA_MODIFIER_WIDE, yara.YARA_MODIFIER_NO_CASE]);
//
//     console.log("ys1", ys1);
// } catch (e) {
//     console.error(e);
// }
//
// try {
//     let ys2 = yara.createYARAString('my_Identifier5', "This is a string", yara.YARA_TYPE_TEXT, [yara.YARA_MODIFIER_WIDE, yara.YARA_MODIFIER_NO_CASE, yara.YARA_MODIFIER_BASE64]);
//
//     console.log("ys2", ys2);
// } catch (e) {
//     console.log("Caught Expected YS2 Exception ", e);
// }

// MIME Types:
const MIMETYPE_JSON = 'application/json';

// Root:
const ROOT_CLASS = 'yara-rule-designer';

// Rule stuff:
const RULE_KIND_DB = "database";
const RULE_KIND_THEORACLE = "theoracle";

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
const YARA_STRING_EDITOR_ELEMENT = `yara-string-editor-element`;
const YARA_STRING_EDITOR_ELEMENT_CLASS = `condition-yara-string-editor-element`;
const YARA_STRING_EDITOR_ELEMENT_CONTAINER = `${ROOT_CLASS}-yara-string-editor-element`;
const CUSTOM_YARA_STRING_EDITOR_ELEMENT = `custom-yara-string-editor-element`;
const CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS = `condition-custom-yara-string-editor-element`;
const CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER = `${ROOT_CLASS}-custom-yara-string-editor-elements`;
const LEFTPANE_DRAGGABLES = [OPERATOR_CONTAINER, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER, YARA_STRING_EDITOR_ELEMENT_CONTAINER];
const YARA_STRING_ELEMENT_JSON_DATA_ATTR = "data-yara-string-json";
const YARA_STRING_TYPE_CLASS_TEXT = "yara-string-type-text";
const YARA_STRING_TYPE_CLASS_HEX = "yara-string-type-hex";
const YARA_STRING_TYPE_CLASS_REGEX = "yara-string-type-regex";

const DESIGNER_EDITOR = `${ROOT_CLASS}-editor`;

// Text and styling:
const NUMBERED_TEXTBOX_CLASS = "numbered-lines";
const SUCCESS_ICON = "<span style='color: green'>&#10003;</color>";
const FAILED_ICON = "<span style='color: red'>&#10005;</span>";
const BGCOLOR_RED_CLASS = "red-bg";
const BGCOLOR_YELLOW_CLASS = "yellow-bg";
const TEXT_COLOR_GREEN_CLASS = "green-text";
const TEXT_COLOR_RED_CLASS = "red-text";
const YARA_VARIABLE_DENOMINATOR = "$";

// Convenience/readability constants:
const MOUSE_CLICK_LEFT = 0;
const MOUSE_CLICK_MIDDLE = 1;
const MOUSE_CLICK_RIGHT = 2;
const OBSERVABLE_CLASSES = ["condition-yara-string-editor-element", "condition-custom-yara-string-editor-element"];
const KEYWORD_CLASS = "condition-keyword";
const KEYWORD_CLASSES = ["condition-keyword"];
const VAR_COUNT_KEYWORD = "condition-keyword-count";
const NUMERIC_CLASS = "condition-numeric";
const NUMERIC_CLASSES = ["condition-numeric"];
const SYNTAX_ERROR = "syntax";

// Customised modals - Settings Modal:
const SETTINGS_MODAL_SAVE_ALL_BUTTON = "settings-modal-save-all-button";
const SETTINGS_MODAL_META_FORM = "settings-modal-meta-form";
const SETTINGS_MODAL_META_FORM_ROW = "yara-meta-";
const SETTINGS_MODAL_META_FORM_DELETE_ROW_BUTTON_PREFIX = `${SETTINGS_MODAL_META_FORM_ROW}-delete-this-row-button`;
const SETTINGS_MODAL_META_FORM_ADD_ROW_BUTTON = `${SETTINGS_MODAL_META_FORM_ROW}-add-row-button`;
const SETTINGS_MODAL_META_FORM_COLUMN_IDENTIFIER_CLASS = "col-md-3 mb-3";
const SETTINGS_MODAL_META_FORM_COLUMN_VALUE_CLASS = "col-md-7 mb-3";
const SETTINGS_MODAL_META_FORM_COLUMN_VALUE_TYPE_CLASS = "col-md-1 mb-3";
const SETTINGS_MODAL_META_FORM_COLUMN_DELETE_ROW_CLASS = "col-md-1 mb-3";

// Customised modals - Add Custom YARA String to editor Modal:
const ADD_CUSTOM_YARA_STRING_MODAL_ADD_BUTTON = "add-custom-yara-string-modal-add-button";
const ADD_CUSTOM_YARA_STRING_MODAL_FORM = "add-custom-yara-string-modal-form";
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM}-row`;
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM}-column`;
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_IDENTIFIER_CLASS = "col-md-3 mb-3";
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_VALUE_CLASS = "col-md-7 mb-3";
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_VALUE_TYPE_CLASS = "col-md-1 mb-3";
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_STRING_TYPE_CLASS = "col-md-1 mb-3";
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_CLASS = `form-row ${ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW}-modifiers`;
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_HEADING_COLUMN_CLASS = "col-md-1 mb-3";
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_CHECKBOX_CLASS = "col-md-2 mb-3";
const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_DATA_INPUT_CLASS = "col-md-10 mb-3";

// Add event listeners.
// -- Buttons:
document.querySelector('#load-rule-button').addEventListener('click', loadRuleDialog);
document.querySelector('#edit-settings-button').addEventListener('click', settingsModal);
document.querySelector('#add-yara-string-button').addEventListener('click', addYARAStringToEditorModal);
document.querySelector('#show-help-button').addEventListener('click', modals.popupHelpModal);
document.querySelector('#add-numeric-element-button').addEventListener('click', function(){ popupAddNumericElementDialog() });
document.querySelector('#clear-rule-button').addEventListener('click', clearRule);
document.querySelector('#submit-rule-button').addEventListener('click', function(){ postRule() });
document.querySelector('#yara-rule-designer-tags-add-button').addEventListener('click', function(){ popupAddTagDialog() });

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
document.querySelector(`#${VAR_COUNT_KEYWORD}`).addEventListener('click', function(){ addToEditor(event) });
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
 * Add a replace-at-index feature for String objects.
 * @param index
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

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
    document.getElementById(CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER),
    document.getElementById(YARA_STRING_EDITOR_ELEMENT_CONTAINER),
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

/**
 * Parses the current observables in the designer (leftpane) to strings that conforms to YARA string syntax.
 *
 * @returns {string}
 */
function getEditorYARAStrings(unique=true) {
    let observables = [];
    let children = getEditorContents();
    if (children.length === 0) {
        throw new NoContentsException("Editor had no contents");
    }

    for (let i = 0; i < children.length; i++) {
        // Check if child is of the observable family by comparing its classList against the OBSERVABLE_CLASSES list.
        // This is because an observable/YARAString may have multiple class names attached to it.
        if ( OBSERVABLE_CLASSES.some(name => [...children[i].classList].includes(name)) ) {
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

/**
 * Parses the current items in the editor to a string that conforms to YARA condition syntax.
 *
 * @returns {string}
 */
function getEditorConditionString() {
    let conditionString = "";
    let children = getEditorContents();
    console.log("getEditorConditionString children", children);

    // Spacing to use in front of a word, to form a coherent sentence structure.
    let preSpacing = "";
    let hasCountOperatorInFront = false;
    for (let i = 0; i < children.length; i++) {
        if (i === 1) {
            // If we're past the first entry we can start prepending spacing.
            preSpacing = " ";
        }

        // Check if child is of the observable family by comparing its classList against the OBSERVABLE_CLASSES list.
        // This is because an observable/YARAString may have multiple class names attached to it.
        if ( OBSERVABLE_CLASSES.some(name => [...children[i].classList].includes(name)) ) {
            if (hasCountOperatorInFront) {
                // Prepend with a YARA variable count operation denominator.
                conditionString += preSpacing + yara.VARIABLE_COUNTER_DENOMINATOR + children[i].id;
                hasCountOperatorInFront = false;
            } else {
                // Prepend with a YARA variable denominator.
                conditionString += preSpacing + yara.VARIABLE_DENOMINATOR + children[i].id;
            }
        } else if (KEYWORD_CLASSES.includes(children[i].className)) {
            // Child is a logical operator
            if (children[i].id === VAR_COUNT_KEYWORD) {
                // This operator should replace the var denominator,
                // so let's set a flag and not add this keyword as a separate entity.
                hasCountOperatorInFront = true;
            } else {
                conditionString += preSpacing + getEditorElementKeywordText(children[i]).toLowerCase();
            }
        } else if (children[i].className === NUMERIC_CLASS) {
            // Child is a numeric element.
            conditionString += preSpacing + getEditorElementKeywordText(children[i]);
        } else {
            const msg = "getEditorConditionString is not supposed to reach an else condition!";
            modals.popupErrorModal("<h2>Programming Error</h2>", msg);
            console.error(msg, children[i]);
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
    let yaraRule = window.currentlyLoadedRule;
    let yaraRuleName = `Whitelist_${yaraRule.title}`; // FIXME: Hardcoded string variable should be made configurable.

    // Get list of observables currently residing in editor DIV.
    let jsonifiedYARAStrings = [];
    for (let yaraString of getEditorYARAStrings()) {
        // Append the previously attached (see: addYARAStrings) YARAString JSON to strings list.
        jsonifiedYARAStrings.push( JSON.parse(yaraString.getAttribute(YARA_STRING_ELEMENT_JSON_DATA_ATTR)) )
    }

    return {
        "name": yaraRuleName,
        "thehive_case_id": yaraRule["thehive_case_id"],
        "namespace": yaraRule["namespace"],
        "tags": getEnabledTags(),
        "meta": yaraRule["meta"],
        "strings": jsonifiedYARAStrings,
        "condition": getEditorConditionString()
    };
}

function fetchGetRequest(url, callback, callbackKwargs=null) {
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
        if (callbackKwargs == null) {
            callback(data);
        } else {
            callback(data, callbackKwargs)
        }
      }).catch(function(error) {
        console.log('fetchRequest failed!', error);
        modals.popupErrorModal("fetchRequest failed!",
            `${error}<br/><br/>Traceback:<br/><p>${error.stack}</p>`);
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
            modals.popupErrorModal("fetchPostRequest failed!",
            `${error}<br/><br/>Traceback:<br/><p>${error.stack}</p>`);
          });
}

function extrapolateMissingRuleInfoFromMeta(rule) {
    let title = "Untitled Rule.";
    let caseId = "N/A";
    let description = "No description";
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

function extrapolateMissingRulesInfoFromMeta(rules) {
    let modifiedRules = [];

    for (let rule of rules) {
        modifiedRules.push(extrapolateMissingRuleInfoFromMeta(rule));
    }

    return modifiedRules
}

function getRuleDBById(ruleId, callback=printRulesTable) {
    // noinspection JSIgnoredPromiseFromCall
    fetchGetRequest(`${GET_RULE_ROUTE}/${ruleId}`, callback);
}

// function getTheOracleRuleByFilename(filename, callback=printRulesTable) {
//     // noinspection JSIgnoredPromiseFromCall
//     fetchGetRequest(`${GET_THEORACLE_RULE_ROUTE}/${filename}`, callback);
// }

function getTheOracleRuleByFilename(filename, callback=printRulesTable) {
    // noinspection JSIgnoredPromiseFromCall
    fetchGetRequest(`${GET_THEORACLE_RULE_ROUTE}/${filename}`, callback);
}

function combineRulesThenPrintRulesTable(additionalRules, existingRules) {
    let combinedRules = {
        "db_rules": extrapolateMissingRulesInfoFromMeta(existingRules["rules"]),
        "theoracle_rules": extrapolateMissingRulesInfoFromMeta(additionalRules["rules"])
    };
    // let extrapolatedCombinedRules = extrapolateMissingRulesInfoFromMeta(combinedRules);

    printRulesTable(combinedRules);
}

function getAdditionalRules(rules, callback=combineRulesThenPrintRulesTable) {
    // Carry received rules into the fetch request
    fetchGetRequest(GET_THEORACLE_RULES_ROUTE, callback, rules);
}

function getRules(callback=getAdditionalRules) {
    fetchGetRequest(GET_RULES_ROUTE, callback);
}

function getRulesDB(callback=printRulesTable) {
    fetchGetRequest(GET_RULES_ROUTE, callback);
}

function getRulesTheOracle(callback=printRulesTable) {
    fetchGetRequest(GET_THEORACLE_RULES_ROUTE, callback);
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

/**
 * Print fetched rules table.
 *
 * Customised printTable code for fetched rules.
 *
 * @param rulesJson
 * @param defaultCheckedRadio
 * @param hideRadios
 * @param modalId
 */
function printRulesTable(rulesJson, defaultCheckedRadio = TABLE_FILTER_CHECKED_RADIO,
                         hideRadios = TABLE_FILTER_HIDDEN_RADIOS, modalId = modals.RESPONSE_MODAL) {
    // let rules = rulesJson["rules"];
    let rules = [];
    for (let dbRule of rulesJson["db_rules"]) {
        dbRule["kind"] = "database";
        rules.push(dbRule);
    }
    for (let theoracleRule of rulesJson["theoracle_rules"]) {
        theoracleRule["kind"] = "theoracle";
        rules.push(theoracleRule);
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
            // Determine loader based on rule kind (where it stems from)
            let loader = function() {modals.popupErrorModal("<h2>ERROR</h2>", "Loader func is unset!")};
            let loaderParam = null;
            if (rules[i].kind === RULE_KIND_DB) {
                loader = loadDBRuleById;
                loaderParam = rules[i]["thehive_case_id"];
            } else if (rules[i].kind === RULE_KIND_THEORACLE) {
                loader = loadTheOracleRuleByFilename;
                loaderParam = rules[i]["source_filename"];
            }

            // If editor isn't empty, prompt for confirmation to avoid possible work loss.
            if (getEditorContents().length > 0) {
                modals.popupConfirmationModal({"action": loader, "args": [loaderParam]}, null,
                    "<h3>You currently have contents in the editor, loading a rule clears the editor.</h3>")
            } else {
                console.log("rules[i]", rules[i]);
                console.log("Loading rule..", loader, loaderParam);
                loader(loaderParam);
                document.getElementById(modals.RESPONSE_MODAL_FOOTER).innerText =
                    `Loaded rule: ${rules[i].title} [ID: ${rules[i]["thehive_case_id"]}]`;
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
        `<p> Rule: ${title}</p>`;
    document.getElementById(DESIGNER_HEADER_CONTENT_BYLINE).innerHTML =
        `<p>ID: ${id}</p>`;
    document.getElementById(DESIGNER_HEADER_CONTENT_DESCRIPTION).innerHTML =
        `<p>${description}</p>`;
}

function setTags(tags) {
    let html = "";
    for (let i = 0; i < tags.length; i++) {
        html += `<input type="checkbox" id="tagCheckbox${i}" class="${DESIGNER_TAGS_CHECKBOX_CLASS}" ` +
            `value="${tags[i]}">\n` +
            `<label for="tagCheckbox${i}" title="${tags[i]}">${tags[i]}</label>\n` +
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

function addNumericElementToEditor(number) {
    if (isNaN(number)) {
        throw Error("addNumericElement got NaN!")
    }

    let numericDOMElement = createElementAndSetAttributes("span", {
        "id": uuidv4(),
        "class": NUMERIC_CLASS
    });

    numericDOMElement.textContent = number;

    // Add to editor
    document.getElementById(DESIGNER_EDITOR).appendChild(numericDOMElement);
}

/**
 * Takes a list of observable data entries, then creates and attaches
 * a YARAString object to them and finally adds them to a given container.
 *
 * If a YARAString cannot be produced from an observable an error is raised and the item is skipped.
 *
 * @param strings                   A list of YARA strings.
 * @param idPrefix                  Prefix string for each observable ID field.
 * @param classBaseName             The base (primary) name of the class to group the YARA strings into.
 * @param destinationContainer       Container element to add YARA strings to.
 * @param defaultStringType         The default YARA string type.
 * @param forceDefaultStringType    Disable string type check, setting it equal to default.
 */
function addYARAStrings(strings, idPrefix, classBaseName, destinationContainer,
                        defaultStringType = yara.YARA_TYPE_TEXT,
                        forceDefaultStringType = false) {
    for (let yaraString of strings) {
        let yaraStringDOMElement = document.createElement("span") ;

        let identifier = yaraString["identifier"];
        let value = yaraString["value"];
        let valueType = yaraString["value_type"];
        let stringType = yaraString["string_type"];
        let modifiers = yaraString["modifiers"];
        let modifier_str = yaraString["modifier_str"];
        let processedStr = yaraString["str"];

        // FIXME: Port string_type determination to backend.
        // if (!forceDefaultStringType) {
        //     // Determine string type based on observable's dataType property.
        //     if (dataType === "regexp") {
        //         stringType = yara.YARA_TYPE_REGEX;
        //     } else {
        //         // Try to determine data type based on data string.
        //         if (data.match(yara.YARA_HEX_REGEX)) {
        //             stringType = yara.YARA_TYPE_HEX;
        //         }
        //     }
        // }

        try {
            // Make sure data can be transformed into a valid YARA String (throws exception if not).
            // let ys = yara.createYARAString(identifier, data, stringType, []);

            // Set necessary attributes.
            yaraStringDOMElement.setAttribute("id", identifier);
            yaraStringDOMElement.setAttribute("class", classBaseName);

            // Set representative text (what user sees).
            let hfModifierString = "";
            if (modifier_str !== "" && modifier_str != null) {
                hfModifierString = ` ${modifier_str}`;
            }

            yaraStringDOMElement.textContent = `${stringType}: ${value}${hfModifierString}`;

            // Append corresponding string type class to classList.
            switch (stringType) {
                case yara.YARA_TYPE_TEXT:
                    yaraStringDOMElement.classList.add(YARA_STRING_TYPE_CLASS_TEXT);
                    break;
                case yara.YARA_TYPE_HEX:
                    yaraStringDOMElement.classList.add(YARA_STRING_TYPE_CLASS_HEX);
                    break;
                case yara.YARA_TYPE_REGEX:
                    yaraStringDOMElement.classList.add(YARA_STRING_TYPE_CLASS_REGEX);
                    break;
                default:
                    let acceptedStr = yara.YARA_STRING_TYPES.join(',');
                    console.error(`stringType has unexpected type! '${stringType}' is not one of: [${acceptedStr}].`);
                    break;
            }

            yaraStringDOMElement.setAttribute(YARA_STRING_ELEMENT_JSON_DATA_ATTR, JSON.stringify(yaraString));

            // Make observable element clickable.
            yaraStringDOMElement.addEventListener('click', function(){ addToEditor(event) });

            // Append observable (DOM Element) to strings container (DOM element).
            document.getElementById(destinationContainer).appendChild(yaraStringDOMElement);
        } catch (e) {
            console.exception(
                `Caught exception while attempting to create YARA String from '${value}', skipping!`, e);
        }
    }
}

/**
 * Clears YARA string containers and then adds new YARA strings to them.
 *
 * @param strings A list of YARA String JSONs.
 */
function setYARAStrings(strings) {
    // Clear any existing strings (leftover from a previously loaded rule)
    clearElement(YARA_STRING_EDITOR_ELEMENT_CONTAINER);

    // Add new strings.
    addYARAStrings(strings, YARA_STRING_EDITOR_ELEMENT, YARA_STRING_EDITOR_ELEMENT_CLASS, YARA_STRING_EDITOR_ELEMENT_CONTAINER)
}

function setEditorElementsByCondition(items) {
    let editorDiv = document.getElementById(DESIGNER_EDITOR);
    console.log("setEditorElementsByCondition", items);

    if (items == null) {
        return;
    }

    let operators = document.getElementsByClassName(KEYWORD_CLASS);
    console.log("Operators", operators);
    let yaraStrings = document.getElementsByClassName(YARA_STRING_EDITOR_ELEMENT_CLASS);
    console.log("YARA Strings", yaraStrings);
    for (let item of items) {
        let target = null;

        if (item.startsWith(yara.VARIABLE_COUNTER_DENOMINATOR)) {
            // Add count operator
            let operator = document.getElementById(VAR_COUNT_KEYWORD);
            console.log('addToEditor (count op)', operator);
            editorDiv.appendChild(makeClone(operator));

            // Replace the counter denominator with a variable denominator
            // in order to handle it as a regular YARA String.
            item = String(yara.VARIABLE_DENOMINATOR + item.substr(1));
        }

        if (item.startsWith(yara.VARIABLE_DENOMINATOR)) {
            // Is YARA string; determine target by string identifier
            for (let ys of yaraStrings) {
                if (ys.id === item.substr(1)) {
                    target = ys;
                }
            }
        } else if (!isNaN(parseInt(item))) {
            // If string is numeric.
            addNumericElementToEditor(parseInt(item));
        } else {
            // Is conditional operator; determine target by operator identifier
            for (let opElem of operators) {
                if (opElem.innerText.toLowerCase() === item.toLowerCase()) {
                    target = opElem;
                }
            }
        }

        // If target was valid and got set, add it to editor div.
        if (target != null) {
            console.log('addToEditor', target);
            editorDiv.appendChild(makeClone(target));
        }
    }
}

/**
 * Loads a YARA Rule (callback function called by getRule).
 *
 * @param rule  YARA Rule.
 */
function loadRuleCallback(rule) {
    // Clear editor.
    clearEditorDivContents();

    // Set the currently loaded rule global variable (used in other functions).
    console.log("Loading rule...", rule);
    window.currentlyLoadedRule = rule;

    // Set title tag and title div.
    setTitle(rule.title, rule.thehive_case_id, rule.description);

    // Set tags div.
    setTags(rule.tags);

    // Set YARA String divs.
    setYARAStrings(rule.strings);

    // Set editor condition:
    setEditorElementsByCondition(rule.condition);

}

/**
 * Loads a YARA Rule by calling getRule with a callback.
 *
 * @param ruleId
 */
function loadDBRuleById(ruleId) {
    getRuleDBById(ruleId, loadRuleCallback);
}

/**
 * Loads a YARA Rule by calling getRule with a callback.
 *
 * @param ruleId
 */
function loadTheOracleRuleByFilename(ruleId) {
    getTheOracleRuleByFilename(ruleId, loadRuleCallback);
}

function makeCollapsibleJSONDetails(json, id) {
    return `<button type="button" class="${modals.RESPONSE_MODAL_BUTTON_JSON_COLLAPSIBLE_CLASS}"\n` +
           `                      data-toggle="collapse" data-target="#${id}"\n` +
           `                      aria-expanded="false" aria-controls="${id}">\n` +
           `     Show JSON\n` +
           `</button>` +
           `<div id="${id}" class="collapse">` +
           `   <div class='${modals.RESPONSE_MODAL_JSON_COLLAPSIBLE_CONTENT_CLASS}'>` +
           `       <pre>` +
           `${escapeHtml(JSON.stringify(json, undefined, 4))}` +
           `       </pre>` +
           `   </div>` +
           `</div>`;
}

/**
 * Converts troublesome characters to HTML-compliant symbols.
 *
 * @param unsafe        String containing unsafe characters.
 * @returns {string}    String with unsafe characters converted to HTML-compliant symbols.
 */
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
  });
}

/**
 * Sets multiple attributes on a HTMLDomElement.
 *
 * @param HTMLDomElement
 * @param attrJSON
 */
function setAttributes(HTMLDomElement, attrJSON) {
    for (let key of Object.keys(attrJSON)) {
        HTMLDomElement.setAttribute(key, attrJSON[key]);
    }
}

/**
 * Combine createElement and setting attributes into one function (significantly lessens code bloat).
 *
 * @param tagName
 * @param attrJSON
 *
 * @returns {HTMLElement}
 */
function createElementAndSetAttributes(tagName, attrJSON) {
    let HTMLDomElement = document.createElement(tagName);

    setAttributes(HTMLDomElement, attrJSON);

    return HTMLDomElement;
}

function addMetaFormDeleteCurrentRowButtonEventListeners(selector) {
    document.querySelector(selector).addEventListener(
            'click', function() {
                // For some reason the button causes the page to redirect to itself, so let's not.
                event.preventDefault();

                let thisRowId = this.getAttribute("_this-meta-row-id");
                let thisRow = document.getElementById(thisRowId);

                // Delete this row from the form element.
                document.getElementById(SETTINGS_MODAL_META_FORM).removeChild(thisRow);
            });
}

/**
 * Callback function for metadata form container's "Add row" button,
 * which sets the onclick function for it and the onclick function for its "Remove this row" child column.
 */
function metaSettingsFormAddRowCallback() {
    document.querySelector(`#${SETTINGS_MODAL_META_FORM_ADD_ROW_BUTTON}`).addEventListener(
        'click', function () {
            // For some reason the button causes the page to redirect to itself, so let's not.
            event.preventDefault();

            // Add generated row to form element.
            let metaForm = document.getElementById(SETTINGS_MODAL_META_FORM);
            let uniqueRowIdSuffix = uuidv4();
            metaForm.appendChild(generateMetaFormRow(
                null, null, null, uniqueRowIdSuffix)
            );

            // Add event listeners to the new row deletion button.
            addMetaFormDeleteCurrentRowButtonEventListeners(
                `#${SETTINGS_MODAL_META_FORM_DELETE_ROW_BUTTON_PREFIX}-${uniqueRowIdSuffix}`);
        });
}

/**
 * Set properties that can only be persistently set after the elements has been added to document.
 *
 * NB: Only use this function in conjunction with a freshly spawned metaForm.
 *     If used multiple times after rows have been added or removed, the indexes will be off.
 *
 * @param modal         Settings modal reference.
 */
function metaSettingsFormCallback(modal) {
    let metaArray = window.currentlyLoadedRule["meta"];

    // Iterate rows that correspond with metaArray.
    for (let i = 0; i < metaArray.length; i++) {
        // Set the currently selected value type item.
        modal.getElementsByClassName("custom-select")[i].value = metaArray[i]["value_type"];

        // Add event listeners to the row deletion button.
        addMetaFormDeleteCurrentRowButtonEventListeners(
            `#${SETTINGS_MODAL_META_FORM_DELETE_ROW_BUTTON_PREFIX}-${i}`);
    }
}

/**
 * Generates a "fake" row with label headings (in order to avoid reprinting labels for every single row)
 *
 * @returns {HTMLElement}   The generated "fake" row heading.
 */
function generateMetaFormRowHeading() {
    let fakeFormRow = createElementAndSetAttributes("div", {
        "class": "form-row",
        "style": "line-height: 0;"  // Reduce some vertical spacing (alas, not near enough).
    });

    // Identifier heading.
    let fakeIdentifierColumn = createElementAndSetAttributes("div", {
        "class": SETTINGS_MODAL_META_FORM_COLUMN_IDENTIFIER_CLASS
    });
    let fakeIdentifierColumnLabel = document.createElement("label");
    fakeIdentifierColumnLabel.htmlFor = `yara-meta-identifier-heading`;
    fakeIdentifierColumnLabel.innerText = "Identifier";

    // Add label to column and then add that column to row.
    fakeIdentifierColumn.appendChild(fakeIdentifierColumnLabel);
    fakeFormRow.appendChild(fakeIdentifierColumn);

    // Value heading.
    let fakeValueColumn = createElementAndSetAttributes("div", {
        "class": SETTINGS_MODAL_META_FORM_COLUMN_VALUE_CLASS
    });
    let fakeValueColumnLabel = document.createElement("label");
    fakeValueColumnLabel.htmlFor = `yara-meta-value-heading`;
    fakeValueColumnLabel.innerText = "Value";

    // Add label to column and then add that column to row.
    fakeValueColumn.appendChild(fakeValueColumnLabel);
    fakeFormRow.appendChild(fakeValueColumn);

    // Value type heading.
    let fakeValueTypeColumn = createElementAndSetAttributes("div", {
        "class": SETTINGS_MODAL_META_FORM_COLUMN_VALUE_TYPE_CLASS
    });
    let fakeValueTypeColumnnLabel = document.createElement("label");
    fakeValueTypeColumnnLabel.htmlFor = `yara-meta-value-type-heading`;
    fakeValueTypeColumnnLabel.innerText = "Value type";

    // Add label to column and then add that column to row.
    fakeValueTypeColumn.appendChild(fakeValueTypeColumnnLabel);
    fakeFormRow.appendChild(fakeValueTypeColumn);

    // Delete current row heading..
    let fakeDeleteThisRowColumn = createElementAndSetAttributes("div", {
        "class": SETTINGS_MODAL_META_FORM_COLUMN_DELETE_ROW_CLASS
    });
    let fakeDeleteThisRowColumnLabel = document.createElement("label");
    fakeDeleteThisRowColumnLabel.htmlFor = `yara-meta-del-row-heading`;
    fakeDeleteThisRowColumnLabel.innerText = "";

    // Add label to column, but don't add it to row as we don't want it visible.
    fakeDeleteThisRowColumn.appendChild(fakeDeleteThisRowColumnLabel);

    return fakeFormRow;
}

function generateMetaFormRow(identifierColumnValue=null, valueColumnValue=null, valueTypeColumnValue=null, idSuffix=null) {
    // Set defaults for any unset (optional) params.
    if (identifierColumnValue == null) {
        identifierColumnValue = ""
    }
    if (valueColumnValue == null) {
        valueColumnValue = ""
    }
    if (valueTypeColumnValue == null) {
        valueTypeColumnValue = yara.YARA_VALUE_TYPE_STR;
    }
    if (idSuffix == null) {
        idSuffix = uuidv4();
    }

    // Define required row structure.
    let metaFormRow = createElementAndSetAttributes("div", {
        // Set a GUID/UUID instead of index to avoid issues with del/add row feature (id collisions).
        "id": `meta-form-row-${uuidv4()}`,
        "class": "form-row"
    });

    // -- COLUMN: Identifier.
    let identifierColumnInputId = `yara-meta-identifier-${idSuffix}`;
    let identifierColumn = createElementAndSetAttributes("div", {
        "class": SETTINGS_MODAL_META_FORM_COLUMN_IDENTIFIER_CLASS
    });
    let identifierColumnLabel = createElementAndSetAttributes("label", {
        "for": identifierColumnInputId,
        "style": "display: none;" // Only use label for computation, heading labels are sufficient.
    });
    identifierColumnLabel.innerText = "Identifier";
    let identifierColumnInput = createElementAndSetAttributes("input", {
        "class": "form-control",
        "id": identifierColumnInputId,
        "value": identifierColumnValue
    });

    // Add label and input element to column and finally column to row.
    identifierColumn.appendChild(identifierColumnLabel);
    identifierColumn.appendChild(identifierColumnInput);
    metaFormRow.appendChild(identifierColumn);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Value column.
    let valueColumnInputId = `yara-meta-value-${idSuffix}`;
    let valueColumn = createElementAndSetAttributes("div", {
        "class": SETTINGS_MODAL_META_FORM_COLUMN_VALUE_CLASS
    });
    let valueColumnLabel = createElementAndSetAttributes("label", {
        "for": valueColumnInputId,
        "style": "display: none;" // Only use label for computation, heading labels are sufficient.
    });
    valueColumnLabel.innerText = "Value";
    let valueColumnInput = createElementAndSetAttributes("input", {
        "class": "form-control",
        "id": valueColumnInputId,
        "value": valueColumnValue
    });

    // Add label and input element to column and finally column to row.
    valueColumn.appendChild(valueColumnLabel);
    valueColumn.appendChild(valueColumnInput);
    metaFormRow.appendChild(valueColumn);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -- COLUMN: Value type.
    let valueTypeColumnSelectId = `yara-meta-value-type-${idSuffix}`;
    let valueTypeColumn = createElementAndSetAttributes("div", {
        "class": SETTINGS_MODAL_META_FORM_COLUMN_VALUE_TYPE_CLASS
    });
    let valueTypeColumnLabel = createElementAndSetAttributes("label", {
        "for": valueTypeColumnSelectId,
        "style": "display: none;" // Only use label for computation, heading labels are sufficient.
    });
    valueTypeColumnLabel.innerText = "Value type";
    let valueTypeColumnSelect = createElementAndSetAttributes("select", {
        "class": "custom-select",
        "id": valueTypeColumnSelectId
    });

    // Add options for all valid value types.
    for (let validValueType of yara.YARA_VALUE_TYPES) {
        let option = document.createElement("option");

        option.value = validValueType;
        option.innerText = validValueType;

       if (validValueType === valueTypeColumnValue) {
           option.selected = true;
       }

       // Add Value type option to select element.
        valueTypeColumnSelect.appendChild(option);
    }

    // Add label and select element to column and finally column to row.
    valueTypeColumn.appendChild(valueTypeColumnLabel);
    valueTypeColumn.appendChild(valueTypeColumnSelect);
    metaFormRow.appendChild(valueTypeColumn);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -- COLUMN: Delete current row.
    let deleteThisRowColumnButtonId = `${SETTINGS_MODAL_META_FORM_DELETE_ROW_BUTTON_PREFIX}-${idSuffix}`;
    let deleteThisRowColumn = createElementAndSetAttributes("div", {
        "class": SETTINGS_MODAL_META_FORM_COLUMN_DELETE_ROW_CLASS
    });
    let deleteThisRowColumnLabel = createElementAndSetAttributes("label", {
        "for": deleteThisRowColumnButtonId
    });
    let deleteThisRowColumnButton = createElementAndSetAttributes("button", {
        "id": deleteThisRowColumnButtonId,
        "class": "btn btn-danger",
        "title": `Delete row: ${identifierColumnValue}`,
        "_this-meta-row-id": metaFormRow.id
    });

    // Add some styling/graphics to the button.
    let buttonGfx = createElementAndSetAttributes("i", {
        "class": "fa fa-trash fa-lg"
    });

    // Add gfx to button, then button to column and finally column to row.
    deleteThisRowColumnButton.appendChild(buttonGfx);
    deleteThisRowColumn.appendChild(deleteThisRowColumnButton);
    metaFormRow.appendChild(deleteThisRowColumn);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    return metaFormRow;
}

/**
 * Generates a form element for editing, adding and removing metadata to include in the rule.
 *
 * @returns {HTMLElement}
 */
function settingsGenerateMetaForm() {
    let metaArray = window.currentlyLoadedRule["meta"];
    console.log(metaArray);

    // Define the form element to hold meta items.
    let metaForm = createElementAndSetAttributes("form", {
        "id": SETTINGS_MODAL_META_FORM,
        "style": "line-height: 0;"  // Reduce some vertical spacing (alas, not near enough).
    });

    // Add a "fake" row with label headings (in order to avoid reprinting labels for every single row)
    metaForm.appendChild(generateMetaFormRowHeading());

    // Add meta items to the meta form element.
    for (let i = 0; i < metaArray.length; i++) {
        // Add generated row to form element.
        metaForm.appendChild(
            generateMetaFormRow(metaArray[i]["identifier"], metaArray[i]["value"], metaArray[i]["value_type"], i)
        )
    }

    return metaForm;
}

/**
 * Generate a metadata container which holds the form element and "add row" button.
 *
 * This is necessary as button shouldn't be part of the form rows,
 * unless you want to deal with indexing issues when adding/removing rows.
 *
 * It should be its own separate untouchable element.
 *
 * @returns {HTMLElement}
 */
function settingsGenerateMetaFormContainer() {
    let container = createElementAndSetAttributes("div", {});

    // Generate the form element for metadata.
    let metaForm = settingsGenerateMetaForm();

    // Add form to container.
    container.appendChild(metaForm);

    // Create button to create new rows and add it to container.
    let addRowButton = createElementAndSetAttributes("button", {
        "id": SETTINGS_MODAL_META_FORM_ADD_ROW_BUTTON,
        "class": "btn btn-primary btn-block",
        "title": "Add row",
        "value": "Add row"
    });

    // Add some styling/graphics to the button.
    let buttonGfx = createElementAndSetAttributes("i", {
        "class": "fa fa-plus fa-lg"
    });

    // Add gfx and text to button, and then add button to container.
    addRowButton.innerText = " Add row";
    addRowButton.prepend(buttonGfx);
    container.appendChild(addRowButton);

    return container;
}

/**
 * Overwrite currently loaded rule's meta with what is listed in the settings form.
 */
function saveMetaSettings() {
    let metaForm = document.getElementById(SETTINGS_MODAL_META_FORM);

    let newMeta = [];
    for (let i = 1; i < metaForm.childNodes.length; i++) {  // Start from 1 as index 0 is the heading/fake-row.
        // Row
        let row = metaForm.childNodes[i];

        // Column via Row.
        let identifierColumn = row.childNodes[0];
        let valueColumn = row.childNodes[1];
        let valueTypeColumn = row.childNodes[2];

        // Value via input/control via label.
        let identifierColumnValue = identifierColumn.childNodes[0].control.value;
        let valueColumnValue = valueColumn.childNodes[0].control.value;
        let valueTypeColumnValue = valueTypeColumn.childNodes[0].control.value;

        let rowStr = `"${identifierColumnValue}" = "${valueColumnValue}" (${valueTypeColumnValue})`;
        console.log(rowStr);

        // Skip if identifier is unset.
        if (identifierColumnValue === "") {
            console.warn("Skipping metadata row (reason: unset identifier)!", rowStr);
            continue;
        } else if (newMeta.some((item => item["identifier"] === identifierColumnValue))) {
            console.warn("Skipping metadata row (reason: identifier already in use by a previous row)!", rowStr);
            continue;
        }

        newMeta.push({
            "identifier": identifierColumnValue,
            "value": valueColumnValue,
            "value_type": valueTypeColumnValue
        });
    }

    window.currentlyLoadedRule["meta"] = newMeta;
}

/**
 * Overwrites current rule properties with what is currently set in the settings modal.
 */
function saveAllSettings() {
    saveMetaSettings();

    console.log("currentlyLoadedRule", window.currentlyLoadedRule);  // FIXME: Remove debug log

    closeModals();
}

/**
 * Sets event listeners etc. on the "save all" button in the settings modal.
 */
function saveAllSettingsButtonCallback() {
    document.querySelector(`#${SETTINGS_MODAL_SAVE_ALL_BUTTON}`).addEventListener(
    'click', function () {
        // For some reason the button causes the page to redirect to itself, so let's not.
        event.preventDefault();

        // Save all settings currently set in the modal (overwrites currently loaded rule's properties).
        saveAllSettings();
        closeModals();
    });
}

/**
 * Popup a modal with rule settings (e.g. metadata to include).
 */
function settingsModal() {
    if (window.currentlyLoadedRule === undefined) {
        modals.popupErrorModal("No rule loaded!", "Cannot edit settings without loading a rule first!");
        return;
    }

    let modalCallbacks = [];

    // Generate the metadata form container.
    let metaFormContainer = settingsGenerateMetaFormContainer();

    // Add necessary form callback to callbacks list.
    modalCallbacks.push(metaSettingsFormCallback, metaSettingsFormAddRowCallback);

    let header = `<h2><i class="fa fa-cog"></i> Settings</h2>`;

    let bodyMiddle =
        `<h3>Metadata</h3><br/>` +
        `${metaFormContainer.outerHTML}`;

    let saveAllSettingsButton = createElementAndSetAttributes("button", {
        "id": SETTINGS_MODAL_SAVE_ALL_BUTTON,
        "class": "btn btn-primary btn-large btn-success btn-block",
        "title": "Save all settings",
        "value": "Save all settings"
    });

    saveAllSettingsButton.innerText = "Save changes";

    let footer = saveAllSettingsButton.outerHTML;

    modalCallbacks.push(saveAllSettingsButtonCallback);

    modals.popupModal(
        modals.RESPONSE_MODAL, header, null, bodyMiddle, null, footer,
        levels.INFO, modalCallbacks);
}

/**
 * Generates a "fake" row with label headings (in order to avoid reprinting labels for every single row)
 *
 * @returns {HTMLElement}   The generated "fake" row heading.
 */
function generateYARAStringModifierFormRowHeading() {
    let fakeFormRow = createElementAndSetAttributes("div", {
        "class": "form-row",
        "style": "line-height: 0;"  // Reduce some vertical spacing (alas, not near enough).
    });

    // Checkbox heading.
    let fakeIdentifierColumn = createElementAndSetAttributes("div", {
        "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_CHECKBOX_CLASS
    });
    let fakeIdentifierColumnLabel = document.createElement("label");
    fakeIdentifierColumnLabel.htmlFor = `yara-string-modifier-checkbox-heading`;
    fakeIdentifierColumnLabel.innerText = "Modifier";

    // Add label to column and then add that column to row.
    fakeIdentifierColumn.appendChild(fakeIdentifierColumnLabel);
    fakeFormRow.appendChild(fakeIdentifierColumn);

    // Data/Payload heading.
    let fakeValueColumn = createElementAndSetAttributes("div", {
        "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_DATA_INPUT_CLASS
    });
    let fakeValueColumnLabel = document.createElement("label");
    fakeValueColumnLabel.htmlFor = `yara-string-modifier-data-heading`;
    fakeValueColumnLabel.innerText = "Payload/Data (if applicable)";

    // Add label to column and then add that column to row.
    fakeValueColumn.appendChild(fakeValueColumnLabel);
    fakeFormRow.appendChild(fakeValueColumn);

    return fakeFormRow;
}

function generateYARAStringModifierFormRows(modifiersCheckboxColumnValue=null, modifiersDataColumnValue=null) {
    let formModifierRows = [];

    for (let modifier of yara.YARA_MODIFIERS) {
        // for row
        let formModifierRow = createElementAndSetAttributes("div", {
        // Set a GUID/UUID instead of index to avoid issues with del/add row feature (id collisions).
        "id": `add-yara-string-form-row-${uuidv4()}`,
        // "class": "form-row "
        "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_CLASS
        });

        // COLUMN: Checkbox
        let modifiersColumnCheckboxesId = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-modifier-checkbox-container`;
        let modifiersCheckboxColumn = createElementAndSetAttributes("div", {
            "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_CHECKBOX_CLASS
        });
        let modifiersColumnLabel = createElementAndSetAttributes("label", {
            "for": modifiersColumnCheckboxesId,
            "style": "display: none;"
        });
        modifiersColumnLabel.innerText = modifier;
        let modifiersColumnCheckboxes = createElementAndSetAttributes("div", {
            "class": "form-group form-check",
            "id": modifiersColumnCheckboxesId
        });

        // Add checkboxes buttons for all available modifiers.
        let checkboxContainer = createElementAndSetAttributes("div", {
            "class": "form-check form-check-inline",
            "style": "display: inline-block;"
        });

        let checkboxId = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-modifier-checkbox-${modifier}`;
        let label = createElementAndSetAttributes("label", {
            "class": "form-check-label",
            "for": checkboxId,
        });
        label.innerText = modifier;
        let checkbox = createElementAndSetAttributes("input", {
            "type": "checkbox",
            "class": "form-check-input",
            "value": modifier,
            "id": checkboxId,
        });


        // Mark checkbox as checked if modifier is in the enabled modifiers list.
        if (modifiersCheckboxColumnValue.includes(modifier)) {
            checkbox.checked = true;
        }

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        // Add modifier checkbox and label to checkbox group.
        modifiersColumnCheckboxes.appendChild(checkboxContainer);

        // Add label and checkbox container element to column and finally column to row.
        modifiersCheckboxColumn.appendChild(modifiersColumnLabel);
        modifiersCheckboxColumn.appendChild(modifiersColumnCheckboxes);
        formModifierRow.appendChild(modifiersCheckboxColumn);
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        // Payload/Data field
        let dataInputId = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-modifiers-data-input-${modifier}`;
        let dataInputColumn = createElementAndSetAttributes("div", {
            "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_DATA_INPUT_CLASS
        });
        let dataInputColumnLabel = createElementAndSetAttributes("label", {
            "for": modifiersColumnCheckboxesId,
            "style": "display: none;"
        });
        dataInputColumnLabel.innerText = modifier;

        let dataInput = createElementAndSetAttributes("input", {
            "class": "form-control",
            "value": "",
            "id": dataInputId,
        });

        if (!yara.YARA_MODIFIERS_WITH_PAYLOAD.includes(modifier)) {
            dataInput.disabled = true;
            dataInput.defaultValue = "This modifier has no custom payload.";
        }
        // // Set data input payload value if given.
        // if (modifiersDataColumnValue != null) {
        //     dataInput.defaultValue = modifiersDataColumnValue;
        //     dataInput.value = modifiersDataColumnValue;
        // }

        dataInputColumn.appendChild(dataInputColumnLabel);
        dataInputColumn.appendChild(dataInput);
        formModifierRow.appendChild(dataInputColumn);

        // Finally append row to list of rows.
        formModifierRows.push(formModifierRow);
    }

    return formModifierRows;
}

function generateCustomYARAStringBuilderForm(
    identifierColumnValue=null, valueColumnValue=null, valueTypeColumnValue=null, stringTypeColumnValue=null,
    modifiersCheckboxColumnValue=null, modifiersDataColumnValue=null) {

    // Set defaults for any unset (optional) params.
    if (identifierColumnValue == null) {
        identifierColumnValue = ""
    }
    if (valueColumnValue == null) {
        valueColumnValue = ""
    }
    if (valueTypeColumnValue == null) {
        valueTypeColumnValue = yara.YARA_VALUE_TYPE_STR;
    }
    if (stringTypeColumnValue == null) {
        stringTypeColumnValue = yara.YARA_TYPE_TEXT;
    }
    if (modifiersCheckboxColumnValue == null) {
        modifiersCheckboxColumnValue = [];
    }
    if (modifiersDataColumnValue == null) {
        modifiersCheckboxColumnValue = [];
    }

    // Define the form element to hold rows..
    let form = createElementAndSetAttributes("form", {
        "id": ADD_CUSTOM_YARA_STRING_MODAL_FORM,
    });

    let formRow1 = createElementAndSetAttributes("div", {
        // Set a GUID/UUID instead of index to avoid issues with del/add row feature (id collisions).
        "id": `add-yara-string-form-row-${uuidv4()}`,
        "class": "form-row"
    });

    // -- COLUMN: Identifier.
    let identifierColumnInputId = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-identifier`;
    let identifierColumn = createElementAndSetAttributes("div", {
        "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_IDENTIFIER_CLASS
    });
    let identifierColumnLabel = createElementAndSetAttributes("label", {
        "for": identifierColumnInputId,
    });
    identifierColumnLabel.innerText = "Identifier";
    let identifierColumnInput = createElementAndSetAttributes("input", {
        "class": "form-control",
        "id": identifierColumnInputId,
        "value": identifierColumnValue
    });

    // Add label and input element to column and finally column to row.
    identifierColumn.appendChild(identifierColumnLabel);
    identifierColumn.appendChild(identifierColumnInput);
    formRow1.appendChild(identifierColumn);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Value column.
    let valueColumnInputId = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-value`;
    let valueColumn = createElementAndSetAttributes("div", {
        "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_VALUE_CLASS
    });
    let valueColumnLabel = createElementAndSetAttributes("label", {
        "for": valueColumnInputId,
    });
    valueColumnLabel.innerText = "Value";
    let valueColumnInput = createElementAndSetAttributes("input", {
        "class": "form-control",
        "id": valueColumnInputId,
        "value": valueColumnValue
    });

    // Add label and input element to column and finally column to row.
    valueColumn.appendChild(valueColumnLabel);
    valueColumn.appendChild(valueColumnInput);
    formRow1.appendChild(valueColumn);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -- COLUMN: Value type.
    let valueTypeColumnSelectId = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-value-type`;
    let valueTypeColumn = createElementAndSetAttributes("div", {
        "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_VALUE_TYPE_CLASS
    });
    let valueTypeColumnLabel = createElementAndSetAttributes("label", {
        "for": valueTypeColumnSelectId,
    });
    valueTypeColumnLabel.innerText = "Value type";
    let valueTypeColumnSelect = createElementAndSetAttributes("select", {
        "class": "custom-select",
        "id": valueTypeColumnSelectId
    });

    // Add options for all valid value types.
    for (let validValueType of yara.YARA_VALUE_TYPES) {
        let option = document.createElement("option");

        option.value = validValueType;
        option.innerText = validValueType;

       if (validValueType === valueTypeColumnValue) {
           option.selected = true;
       }

       // Add Value type option to select element.
        valueTypeColumnSelect.appendChild(option);
    }

    // Add label and select element to column and finally column to row.
    valueTypeColumn.appendChild(valueTypeColumnLabel);
    valueTypeColumn.appendChild(valueTypeColumnSelect);
    formRow1.appendChild(valueTypeColumn);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -- COLUMN: String type.
    let stringTypeColumnSelectId = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-string-type`;
    let stringTypeColumn = createElementAndSetAttributes("div", {
        "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_STRING_TYPE_CLASS
    });
    let stringTypeColumnLabel = createElementAndSetAttributes("label", {
        "for": stringTypeColumnSelectId,
    });
    stringTypeColumnLabel.innerText = "String type";
    let stringTypeColumnSelect = createElementAndSetAttributes("select", {
        "class": "custom-select",
        "id": stringTypeColumnSelectId
    });

    // Add options for all valid string types.
    for (let validStringType of yara.YARA_STRING_TYPES) {
        let option = document.createElement("option");

        option.value = validStringType;
        option.innerText = validStringType;

       if (validStringType === stringTypeColumnValue) {
           option.selected = true;
       }

       // Add Value type option to select element.
        stringTypeColumnSelect.appendChild(option);
    }

    // Add label and select element to column and finally column to row.
    stringTypeColumn.appendChild(stringTypeColumnLabel);
    stringTypeColumn.appendChild(stringTypeColumnSelect);
    formRow1.appendChild(stringTypeColumn);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    let formRow2 = createElementAndSetAttributes("div", {
    // Set a GUID/UUID instead of index to avoid issues with del/add row feature (id collisions).
    "id": `add-yara-string-form-row-${uuidv4()}`,
    "class": "form-row"
    });
    let modifiersHeadingColumnId = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-modifiers-heading`;
    let modifiersHeadingColumn = createElementAndSetAttributes("div", {
        "class": ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_HEADING_COLUMN_CLASS
    });
    let modifiersHeadingColumnLabel = createElementAndSetAttributes("label", {
        "for": modifiersHeadingColumnId,
    });
    modifiersHeadingColumnLabel.innerHTML = "<h2>Modifiers</h2>";
    modifiersHeadingColumn.appendChild(modifiersHeadingColumnLabel);
    formRow2.appendChild(modifiersHeadingColumn);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -- ROWs: Modifiers.
    let formModifierRows = generateYARAStringModifierFormRows(modifiersCheckboxColumnValue, modifiersDataColumnValue);


    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    form.appendChild(formRow1);
    form.appendChild(formRow2);
    form.appendChild(generateYARAStringModifierFormRowHeading());
    for (let row of formModifierRows) {
        form.appendChild(row);
    }

    return form;
}

function addYARAStringToEditorCallback() {
    document.querySelector(`#${ADD_CUSTOM_YARA_STRING_MODAL_ADD_BUTTON}`).addEventListener(
    'click', function () {

        // For some reason the button causes the page to redirect to itself, so let's not.
        event.preventDefault();

        // Gather data from columns.
        let identifierValue = document.getElementById(`${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-identifier`).value;
        let valueValue = document.getElementById(`${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-value`).value;
        let valueTypeValue = document.getElementById(`${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-value-type`).value;
        let stringTypeValue = document.getElementById(`${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-string-type`).value;

        let modifiers = [];

        for (let modifierRow of document.getElementsByClassName(ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_CLASS)) {
            console.log("modifier row", modifierRow);
            let checkboxColumn = modifierRow.childNodes[0];
            let dataColumn = modifierRow.childNodes[1];

            let checkboxColumnLabel = checkboxColumn.firstChild;
            let checkboxColumnCheckboxElement = checkboxColumn.lastChild.firstChild.firstChild;
            let dataColumnInputElement = dataColumn.lastChild;

            if (checkboxColumnCheckboxElement.checked) {
                modifiers.push({
                    "keyword": checkboxColumnLabel.innerText,
                    "data": !dataColumnInputElement.disabled ? dataColumnInputElement.value : null,
                });
            }
        }

        let modifier_str = "";

        let spacing = '';
        for (let modifier of modifiers) {
            let keyword = modifier["keyword"];
            let data = modifier["data"];

            if (modifier["data"] != null) {
                let wrappedDataString = yara.wrapYARAStringModifierData(keyword, data);
                modifier_str += `${spacing}${keyword}(${wrappedDataString})`;
            } else {
                modifier_str += `${spacing}${keyword}`;
            }
            // Start using spacing after first element (avoids useless leading space).
            spacing = ' ';
        }

        // Create YARA String object.
        let yaraString = {
            "identifier": identifierValue,
            "value": valueValue,
            "value_type": valueTypeValue,
            "string_type": stringTypeValue,
            "modifiers": modifiers,
            // "modifier_str": modifiers.join(' ').split(' '),
            "modifier_str": modifier_str,
            "str": null // FIXME: Generate the proper string.
        };

        console.log("Created/Modifier YARA String", yaraString);

        // Add object to available YARA Strings/Observables
        addYARAStrings([yaraString], YARA_STRING_EDITOR_ELEMENT, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER);

        // Add object to editor. // FIXME: Should probably be changed to a fork of addToEditor that takes YARA string obj not clickEvent.
        addYARAStrings([yaraString], YARA_STRING_EDITOR_ELEMENT, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS, DESIGNER_EDITOR);
        closeModals();
    });

    // FIXME: Add modifiers checkbox restriction ev listener logic.
}

/**
 * Pops up a modal where you configure a custom YARA String and then adds it to editor element.
 */
function addYARAStringToEditorModal() {
    let modalCallbacks = [];
    let addButtonTitle = "Add to Editor";

     // Generate the YARA String builder form.
    let form = generateCustomYARAStringBuilderForm();

    // Add necessary form callback to callbacks list.
    // modalCallbacks.push(metaSettingsFormCallback, metaSettingsFormAddRowCallback);

    let header = `<h2><i class="fa fa-plus"></i> Define and Add Custom YARA String to Editor</h2>`;

    let bodyMiddle =`${form.outerHTML}`;

    let addYARAStringToEditorButton = createElementAndSetAttributes("button", {
        "id": ADD_CUSTOM_YARA_STRING_MODAL_ADD_BUTTON,
        "class": "btn btn-primary btn-large btn-success btn-block",
        "title": addButtonTitle,
        "value": addButtonTitle
    });

    addYARAStringToEditorButton.innerText = addButtonTitle;

    // Put the 'add' button in the footer.
    let footer = addYARAStringToEditorButton.outerHTML;

    // Callback for assigning an event listener to the 'add' button.
    modalCallbacks.push(addYARAStringToEditorCallback);

    modals.popupModal(
        modals.RESPONSE_MODAL, header, null, bodyMiddle, null, footer,
        levels.INFO, modalCallbacks);
}

/**
 * Handles the returned response to postRule.
 * @param json
 */
function handlePostRuleResponse(json) {
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
        let jsonToCommit = {
            "source_path": window.currentlyLoadedRule["source_path"],
            "name": window.currentlyLoadedRule["name"],
            "thehive_case_id": window.currentlyLoadedRule["thehive_case_id"]
        };

        console.log("postCommit(jsonToCommit)", jsonToCommit);
        postCommit(jsonToCommit);

        // Close modal after handling button action.
        document.getElementById(modals.CONFIRMATION_MODAL).style.display = "none";
    };
}

/**
 * Make a custom POST request for non-form elements like DIV and SPAN.
 */
function postRule(json=null) {
    if (json == null) {
        json = getRuleJsonFromEditorElements();
    }
    try {
        let xhr = new XMLHttpRequest();  // FIXME: Replace antiquated XHR with fetch.

        console.log("POST URL: " + POST_RULE_ROUTE);

        xhr.open("POST", POST_RULE_ROUTE, true);
        xhr.setRequestHeader('Content-Type', MIMETYPE_JSON);

        // Add custom handling of the response returned by XHR POST URL.
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // console.log("postRule XHR", xhr);
                // console.log("postRule XHR Response text", xhr.responseText);
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

function popupAddNumericElementDialog() {
    let numberInputString = prompt("Enter integer number", "");
    console.log("numberInputString", numberInputString);

    if (numberInputString !== null && numberInputString !== "") {
        let number = parseInt(numberInputString);

        if (!isNaN(number)) {
            addNumericElementToEditor(number);
        }
    }
}

function popupAddTagDialog() {
    let newTag = prompt("Enter tag name", "");
    console.log("newTag", newTag);

    if (newTag !== null && newTag !== "") {
        window.currentlyLoadedRule.tags.push(newTag);
        setTags(window.currentlyLoadedRule.tags);
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
 * Closes any open modals.
 */
function closeModals() {
    for ( let modalElement of document.getElementsByClassName(modals.MODAL_CLASS) ) {
        if (modalElement.style.display !== "none") {
            console.log("Closed open modal: " + modalElement.id);
            modalElement.style.display = "none";
        }
    }
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
            closeModals();

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
    // console.log("makeClone", node);
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
    loadDBRuleById(idParm);
}

// Indicate that script ran through to the end during the initial load.
console.log("Ready.");
