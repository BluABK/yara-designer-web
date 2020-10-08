import {clearElement, createElementAndSetAttributes, makeClone, uuidv4} from "../../modules/utils.js";
import * as yara from "../../modules/yara.js";
import {clickDraggableOperator, clickDraggableYARAString} from "../click_events.js";
import {NoContentsException} from "../../modules/exceptions.js";
import * as modals from "../../modules/modals.js";

/** Constants **/
// MIME Types:
export const MIMETYPE_JSON = 'application/json';

// Root:
export const ROOT_CLASS = 'yara-rule-designer';

// Rule stuff:
export const RULE_KIND_DB = "database";
export const RULE_KIND_THEORACLE = "theoracle";

// Modifying classes
export const SIZE_WIDE_CLASS = "size-wide";
export const SIZE_FULLWIDTH_CLASS = "size-fullwidth";

// Tables:
export const CUSTOM_TABLE_CLASS = "custom-table";
export const CUSTOM_TABLE_CONTAINER = `${CUSTOM_TABLE_CLASS}-container`;
export const TABLE_FILTER_INPUT_SUFFIX = "input-filter";
export const TABLE_FILTER_RADIO_CLASS_SUFFIX = `${TABLE_FILTER_INPUT_SUFFIX}-radios`;
export const TABLE_FILTER_COUNT = "filter-count";
export const TABLE_FILTER_CHECKED_RADIO = "Title";
export const TABLE_FILTER_HIDDEN_RADIOS = ["Pending"];

// Table: -- Fetched Rules
export const RULES_TABLE = "fetched-rules";

// Designer:
export const HTML_TITLE = `${ROOT_CLASS}-title`;
export const DESIGNER_HEADER = `${ROOT_CLASS}-header`;
export const DESIGNER_HEADER_CONTENT = `${DESIGNER_HEADER}-content`;
export const DESIGNER_HEADER_CONTENT_TITLE = `${DESIGNER_HEADER_CONTENT}-title`;
export const DESIGNER_HEADER_CONTENT_BYLINE = `${DESIGNER_HEADER_CONTENT}-byline`;
export const DESIGNER_HEADER_CONTENT_DESCRIPTION = `${DESIGNER_HEADER_CONTENT}-description`;

export const DESIGNER_TAGS = `${ROOT_CLASS}-tags`;
export const DESIGNER_TAGS_CHECKBOX_CLASS = "yara-tag-checkbox";
export const OPERATOR_CONTAINER = `${ROOT_CLASS}-operators`;
export const YARA_STRING_EDITOR_ELEMENT = `yara-string-editor-element`;
export const YARA_STRING_EDITOR_ELEMENT_CLASS = `condition-yara-string-editor-element`;
export const YARA_STRING_EDITOR_ELEMENT_CONTAINER = `${ROOT_CLASS}-yara-string-editor-element`;
export const CUSTOM_YARA_STRING_EDITOR_ELEMENT = `custom-yara-string-editor-element`;
export const CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS = `condition-custom-yara-string-editor-element`;
export const CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER = `${ROOT_CLASS}-custom-yara-string-editor-elements`;
export const LEFTPANE_DRAGGABLES = [OPERATOR_CONTAINER, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER, YARA_STRING_EDITOR_ELEMENT_CONTAINER];
export const LEFTPANE_YARA_STRING_ELEMENT_CONTAINERS = [CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER, YARA_STRING_EDITOR_ELEMENT_CONTAINER];
export const YARA_STRING_ELEMENT_JSON_DATA_ATTR = "data-yara-string-json";
export const YARA_STRING_TYPE_CLASS_TEXT = "yara-string-type-text";
export const YARA_STRING_TYPE_CLASS_HEX = "yara-string-type-hex";
export const YARA_STRING_TYPE_CLASS_REGEX = "yara-string-type-regex";

export const DESIGNER_EDITOR = `${ROOT_CLASS}-editor`;

// Text and styling:
export const NUMBERED_TEXTBOX_CLASS = "numbered-lines";
export const SUCCESS_ICON = "<span style='color: green'>&#10003;</color>";
export const FAILED_ICON = "<span style='color: red'>&#10005;</span>";
export const BGCOLOR_RED_CLASS = "red-bg";
export const BGCOLOR_YELLOW_CLASS = "yellow-bg";
export const TEXT_COLOR_GREEN_CLASS = "green-text";
export const TEXT_COLOR_RED_CLASS = "red-text";
export const YARA_VARIABLE_DENOMINATOR = "$";

// Convenience/readability constants:
export const MOUSE_CLICK_LEFT = 0;
export const MOUSE_CLICK_MIDDLE = 1;
export const MOUSE_CLICK_RIGHT = 2;
export const OBSERVABLE_CLASSES = [YARA_STRING_EDITOR_ELEMENT_CLASS, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS];
export const KEYWORD_CLASS = "condition-keyword";
export const KEYWORD_CLASSES = ["condition-keyword"];
export const VAR_COUNT_KEYWORD = "condition-keyword-count";
export const NUMERIC_CLASS = "condition-numeric";
export const NUMERIC_CLASSES = ["condition-numeric"];
export const SYNTAX_ERROR = "syntax";

// Customised modals - Settings Modal:
export const SETTINGS_MODAL_GENERAL_FORM = "settings-modal-general-form";
export const SETTINGS_MODAL_GENERAL_FORM_COLUMN_TITLE_INPUT = "general-settings-title-column-input";
export const SETTINGS_MODAL_SAVE_ALL_BUTTON = "settings-modal-save-all-button";
export const SETTINGS_MODAL_META_FORM = "settings-modal-meta-form";
export const SETTINGS_MODAL_META_FORM_ROW = "yara-meta-";
export const SETTINGS_MODAL_META_FORM_DELETE_ROW_BUTTON_PREFIX = `${SETTINGS_MODAL_META_FORM_ROW}-delete-this-row-button`;
export const SETTINGS_MODAL_META_FORM_ADD_ROW_BUTTON = `${SETTINGS_MODAL_META_FORM_ROW}-add-row-button`;
export const SETTINGS_MODAL_META_FORM_COLUMN_IDENTIFIER_CLASS = "col-md-3 mb-3";
export const SETTINGS_MODAL_META_FORM_COLUMN_VALUE_CLASS = "col-md-7 mb-3";
export const SETTINGS_MODAL_META_FORM_COLUMN_VALUE_TYPE_CLASS = "col-md-1 mb-3";
export const SETTINGS_MODAL_META_FORM_COLUMN_DELETE_ROW_CLASS = "col-md-1 mb-3";

// Customised modals - Add Custom YARA String to editor Modal:
export const ADD_CUSTOM_YARA_STRING_MODAL_ADD_BUTTON = "add-custom-yara-string-modal-add-button";
export const ADD_CUSTOM_YARA_STRING_MODAL_SAVE_BUTTON = "add-custom-yara-string-modal-save-button";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM = "add-custom-yara-string-modal-form";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM}-row`;
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM}-column`;
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_IDENTIFIER_CLASS = "col-md-3 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_VALUE_CLASS = "col-md-7 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_VALUE_TYPE_CLASS = "col-md-1 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_STRING_TYPE_CLASS = "col-md-1 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_CLASS = `form-row ${ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW}-modifiers`;
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_HEADING_COLUMN_CLASS = "col-md-1 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_CHECKBOX_CLASS = "col-md-2 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_DATA_INPUT_CLASS = "col-md-10 mb-3";

export function setTitle(title, id, description=null) {
    document.getElementById(HTML_TITLE).innerText = title;
    document.getElementById(DESIGNER_HEADER_CONTENT_TITLE).innerHTML =
        `<p> Rule: ${title}</p>`;
    document.getElementById(DESIGNER_HEADER_CONTENT_BYLINE).innerHTML =
        `<p>ID: ${id}</p>`;
    document.getElementById(DESIGNER_HEADER_CONTENT_DESCRIPTION).innerHTML =
        `<p>${description}</p>`;
}

export function setTags(tags) {
    let html = "";
    for (let i = 0; i < tags.length; i++) {
        html += `<input type="checkbox" id="tagCheckbox${i}" class="${DESIGNER_TAGS_CHECKBOX_CLASS}" ` +
            `value="${tags[i]}">\n` +
            `<label for="tagCheckbox${i}" title="${tags[i]}">${tags[i]}</label>\n` +
            `<div class="w-100"></div>\n`;
    }
    document.getElementById(DESIGNER_TAGS).innerHTML = html;
}

export function clearEditorDivContents() {
    let editorDiv = document.getElementById(DESIGNER_EDITOR);
    editorDiv.textContent = '';
}

/**
 * Set the editor condition to the following list of items.
 *
 * @param items
 */
export function setEditorElementsByCondition(items) {
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
            addElementToEditor(target);
        }
    }
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
export function addYARAStrings(strings, idPrefix, classBaseName, destinationContainer,
                        defaultStringType = yara.YARA_TYPE_TEXT,
                        forceDefaultStringType = false) {
    let generatedStrings = [];
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
            yaraStringDOMElement.addEventListener('click', function(){ clickDraggableYARAString(event) });

            // Append observable (DOM Element) to strings container (DOM element).
            document.getElementById(destinationContainer).appendChild(yaraStringDOMElement);

            generatedStrings.push(yaraStringDOMElement);
        } catch (e) {
            console.exception(
                `Caught exception while attempting to create YARA String from '${value}', skipping!`, e);
        }
    }

    return generatedStrings;
}

/**
 * Clears YARA string containers and then adds new YARA strings to them.
 *
 * @param strings A list of YARA String JSONs.
 */
export function setYARAStrings(strings) {
    // Clear any existing strings (leftover from a previously loaded rule)
    clearElement(YARA_STRING_EDITOR_ELEMENT_CONTAINER);

    // Add new strings.
    addYARAStrings(strings, YARA_STRING_EDITOR_ELEMENT, YARA_STRING_EDITOR_ELEMENT_CLASS, YARA_STRING_EDITOR_ELEMENT_CONTAINER)
}

export function addNumericElementToEditor(number) {
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
 * Helper function for adding a generic element to editor.
 *
 * @param element
 * @returns {*}
 */
export function addElementToEditor(element) {
    console.log('Add element to editor', element);
    // Store element's classList contents as an Array, for later use.
    let classList = Array(...element.classList);

    // Clone element.
    let clone = makeClone(element);

    // Make element clickable again (ev listeners are lost when cloning).
    if (classList.includes(YARA_STRING_EDITOR_ELEMENT_CLASS) ||
        classList.includes(CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS)
    ) {
        clone.addEventListener('click', function(){ clickDraggableYARAString(event) });
    } else if (classList.includes(KEYWORD_CLASS)) {
        clone.addEventListener('click', function(){ clickDraggableOperator(event) });
    } else if (classList.includes(NUMERIC_CLASS)) {
        console.warn("FIXME: Implement onclick for numeric elements!")
    }

    // Add element to editor.
    document.getElementById(DESIGNER_EDITOR).appendChild(clone);

    // Return added element.
    return clone;
}

// Used by clickEvent (left mouse), FIXME: Investigate possible redundancy with addElementToEditor.
export function addElement(elem) {
    let editorDiv = document.getElementById(DESIGNER_EDITOR);

    console.log('addToEditor', elem);
    editorDiv.appendChild(makeClone(elem));
}

// Used by clickEvent (mid mouse), FIXME: Investigate possible redundancy with addElementToEditor.
export function removeElement(elem) {
    let editorDiv = document.getElementById(DESIGNER_EDITOR);

    console.log("removeElement", elem);
    editorDiv.removeChild(elem);
}

/**
 * Helper function for adding a generic element to editor by ID.
 *
 * @param elementId
 * @returns {*}
 */
export function addElementById(elementId) {
    return addElementToEditor(document.getElementById(elementId));
}

export function addStringsFromRule(rule) {
    // Add new strings.
    addYARAStrings(rule.strings, YARA_STRING_EDITOR_ELEMENT, YARA_STRING_EDITOR_ELEMENT_CLASS,
        YARA_STRING_EDITOR_ELEMENT_CONTAINER)
}

export function getEditorContents() {
    return document.getElementById(DESIGNER_EDITOR).children;
}

/**
 * Parses the current observables in the designer (leftpane) to strings that conforms to YARA string syntax.
 *
 * @returns {Array}
 */
export function getEditorYARAStrings(unique=true) {
    let observables = [];
    let children = getEditorContents();
    console.log("children", children);
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

export function getEditorElementKeywordText(element) {
    // Get text string.
    return $(element).text();
}

/**
 * Parses the current items in the editor to a string that conforms to YARA condition syntax.
 *
 * @returns {string}
 */
export function getEditorConditionString() {
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

export function getEnabledTags() {
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
export function getRuleJsonFromElements() {
    let yaraRule = window.currentlyLoadedRule;
    console.log("getRuleJsonFromElements yaraRule", yaraRule);

    if (!yaraRule) {
        // Return null if no rule is currently loaded.
        return null;
    }

    let yaraRuleName = yaraRule.title;

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