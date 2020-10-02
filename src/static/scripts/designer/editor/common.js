import {
    CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS,
    DESIGNER_EDITOR,
    DESIGNER_HEADER_CONTENT_BYLINE,
    DESIGNER_HEADER_CONTENT_DESCRIPTION,
    DESIGNER_HEADER_CONTENT_TITLE,
    DESIGNER_TAGS,
    DESIGNER_TAGS_CHECKBOX_CLASS,
    HTML_TITLE, KEYWORD_CLASS, KEYWORD_CLASSES, NUMERIC_CLASS, OBSERVABLE_CLASSES, VAR_COUNT_KEYWORD,
    YARA_STRING_EDITOR_ELEMENT,
    YARA_STRING_EDITOR_ELEMENT_CLASS,
    YARA_STRING_EDITOR_ELEMENT_CONTAINER,
    YARA_STRING_ELEMENT_JSON_DATA_ATTR,
    YARA_STRING_TYPE_CLASS_HEX,
    YARA_STRING_TYPE_CLASS_REGEX,
    YARA_STRING_TYPE_CLASS_TEXT
} from "../../constants.js";
import {clearElement, createElementAndSetAttributes, makeClone, uuidv4} from "../../modules/utils.js";
import * as yara from "../../modules/yara.js";
import {clickDraggableOperator, clickDraggableYARAString} from "../click_events.js";
import {NoContentsException} from "../../modules/exceptions.js";
import * as modals from "../../modules/modals.js";

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