/**
 * Modal implementations and non-generic code specific to the designer.
 **/
import {containsNonSeparatorChar, createElementAndSetAttributes, escapeHtml} from "../modules/utils.js";
import * as modals from "../modules/modals.js";
import * as levels from "../modules/levels.js";
import {NO_CONTENTS_EXCEPTION} from "../modules/exceptions.js";
import * as yara from "../modules/yara.js";
import {md5} from "../third-party/md5.js";
import {
    CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER,
    DESIGNER_EDITOR, LEFTPANE_YARA_STRING_ELEMENT_CONTAINERS, NUMERIC_CLASS, YARA_STRING_EDITOR_ELEMENT, YARA_STRING_ELEMENT_JSON_DATA_ATTR,
    addElementById, addNumericElementToEditor, addYARAStrings, clearEditorDivContents, getRuleJsonFromElements
} from "./editor/common.js";
import {
    ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN, ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_CLASS,
    SETTINGS_MODAL_META_FORM, SETTINGS_MODAL_SAVE_ALL_BUTTON,
    generateCustomYARAStringBuilderForm, setYARAStringFormValues, saveGeneralSettings,
    settingsGenerateGeneralFormContainer, settingsGenerateMetaFormContainer, metaSettingsFormCallback,
    metaSettingsFormAddRowCallback
} from "./designer_forms.js";



// Customised modals - Add Custom YARA String to editor Modal:
const ADD_CUSTOM_YARA_STRING_MODAL_ADD_BUTTON = "add-custom-yara-string-modal-add-button";
const ADD_CUSTOM_YARA_STRING_MODAL_SAVE_BUTTON = "add-custom-yara-string-modal-save-button";

export function makeCollapsibleJSONDetails(json, id) {
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

export function getYARAStringJSONFromStringEditorModal() {
            // Gather data from columns.
        let identifierValue = document.getElementById(`${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-identifier`).value;
        let valueValue = document.getElementById(`${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-value`).value;
        let valueTypeValue = document.getElementById(`${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-value-type`).value;
        let stringTypeValue = document.getElementById(`${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-string-type`).value;

        if (!containsNonSeparatorChar(identifierValue)) {
            identifierValue = yara.sanitizeIdentifier(md5(valueValue));
        }

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

        // Return YARA String object.
        return {
            "identifier": identifierValue,
            "value": valueValue,
            "value_type": valueTypeValue,
            "string_type": stringTypeValue,
            "modifiers": modifiers,
            // "modifier_str": modifiers.join(' ').split(' '),
            "modifier_str": modifier_str,
            "str": null // FIXME: Generate the proper string.
        };
}

export function editYARAStringModalCallback() {
    document.querySelector(`#${ADD_CUSTOM_YARA_STRING_MODAL_SAVE_BUTTON}`).addEventListener(
    'click', function () {
            // For some reason the button causes the page to redirect to itself, so let's not.
            event.preventDefault();

            let oldElement = document.getElementById(window.currentlyEditingThisYARAStringID);
            let oldElementCopy = document.getElementById(window.currentlyEditingThisYARAStringID).cloneNode(true);

            // Clone current items to avoid null ptr headaches later.
            let editorConditionItems = [];
            for (let child of document.getElementById(DESIGNER_EDITOR).childNodes) {
                editorConditionItems.push(child.cloneNode(true));
            }

            let yaraString = getYARAStringJSONFromStringEditorModal();
            console.log("Created/Modifier YARA String", yaraString);

            // Delete the old imported observable (to avoid identifier clash in case only modifier state changed
            // (i.e. no new md5 in identifier)

            // Since we're not sure which container it originated from, we'll loop through them all.
            for (let containerID of LEFTPANE_YARA_STRING_ELEMENT_CONTAINERS) {
                for (let child of document.getElementById(containerID).children) {
                    if (child.id === window.currentlyEditingThisYARAStringID) {
                        console.log("Remove child from", document.getElementById(containerID));
                        document.getElementById(containerID).removeChild(oldElement);
                    }
                }
            }

            // Add the (new) modified object to available User-defined YARA Strings/Observables.
            let generatedYARAStringElements = addYARAStrings(
                [yaraString], YARA_STRING_EDITOR_ELEMENT, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS,
                CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER);

            // Clear editor.
            clearEditorDivContents();

            // Rebuild editor condition (to reflect any modified items).
            for (let item of editorConditionItems) {
                // Locate item in source container in order to clone the latest version (if edited etc).
                console.log("item", item);

                if (item.id === oldElementCopy.id) {
                    // If this is the edited element, replace with the new version.
                    addElementById(generatedYARAStringElements[0].id);
                } else if (Array(...item.classList).includes(NUMERIC_CLASS)) {
                    // If string is numeric (as these do not exist in the leftpane).
                    addNumericElementToEditor(parseInt(item.textContent));
                } else {
                    // Else pick by id which should always return the corresponding source element.
                    addElementById(item.id);
                }
            }

            window.currentlyEditingThisYARAStringID = null;

            modals.closeModals();
    });

    // FIXME: Add modifiers checkbox restriction ev listener logic.
}

export function addYARAStringToEditorCallback() {
    document.querySelector(`#${ADD_CUSTOM_YARA_STRING_MODAL_ADD_BUTTON}`).addEventListener(
    'click', function () {
        // For some reason the button causes the page to redirect to itself, so let's not.
        event.preventDefault();

        let yaraString = getYARAStringJSONFromStringEditorModal();
        console.log("Created/Modifier YARA String", yaraString);

        // Add object to available YARA Strings/Observables
        addYARAStrings([yaraString], YARA_STRING_EDITOR_ELEMENT, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER);

        // Add object to editor. // FIXME: Should probably be changed to a fork of addToEditor that takes YARA string obj not clickEvent.
        addYARAStrings([yaraString], YARA_STRING_EDITOR_ELEMENT, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS, DESIGNER_EDITOR);
        modals.closeModals();
    });

    // FIXME: Add modifiers checkbox restriction ev listener logic.
}

/**
 * Pops up a modal where you configure a custom YARA String and then adds it to editor element.
 */
export function addYARAStringToEditorModal() {
    let modalCallbacks = [];
    let addButtonTitle = "Add to Editor";

     // Generate the YARA String builder form.
    let form = generateCustomYARAStringBuilderForm();

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
 * Pops up a modal where you configure an existing YARA String.
 */
export function editYARAStringModal(YARAStringDOMElement) {
    // Store a reference to the string in global scope for use in callback.
    window.currentlyEditingThisYARAStringID = YARAStringDOMElement.getAttribute("id");

    let jsonData = JSON.parse(YARAStringDOMElement.getAttribute(YARA_STRING_ELEMENT_JSON_DATA_ATTR));
    let modalCallbacks = [];
    let saveButtonTitle = "Save Changes";

    console.log(jsonData);

     // Generate the YARA String builder form.
    let form = generateCustomYARAStringBuilderForm();

    let header = `<h2><i class="fa fa-plus"></i>&nbsp;Edit YARA String</h2>`;

    let bodyMiddle =`${form.outerHTML}`;

    let saveYARAStringChangesButton = createElementAndSetAttributes("button", {
        "id": ADD_CUSTOM_YARA_STRING_MODAL_SAVE_BUTTON,
        "class": "btn btn-primary btn-large btn-success btn-block",
        "title": saveButtonTitle,
        "value": saveButtonTitle
    });

    saveYARAStringChangesButton.innerText = saveButtonTitle;

    // Put the 'add' button in the footer.
    let footer = saveYARAStringChangesButton.outerHTML;

    // Callback for assigning an event listener to the 'add' button.
    modalCallbacks.push(editYARAStringModalCallback);

    modals.popupModal(
        modals.RESPONSE_MODAL, header, null, bodyMiddle, null, footer,
        levels.INFO, modalCallbacks);

    // Set values.
    setYARAStringFormValues(jsonData["identifier"], jsonData["value"], jsonData["value_type"], jsonData["string_type"],
        jsonData["modifiers"]);
}

/**
 * Overwrite currently loaded rule's meta with what is listed in the settings form.
 */
export function saveMetaSettings() {
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
export function saveAllSettings() {
    saveGeneralSettings();
    saveMetaSettings();

    modals.closeModals();
}

/**
 * Sets event listeners etc. on the "save all" button in the settings modal.
 */
export function saveAllSettingsButtonCallback() {
    document.querySelector(`#${SETTINGS_MODAL_SAVE_ALL_BUTTON}`).addEventListener(
    'click', function () {
        // For some reason the button causes the page to redirect to itself, so let's not.
        event.preventDefault();

        // Save all settings currently set in the modal (overwrites currently loaded rule's properties).
        saveAllSettings();
        modals.closeModals();
    });
}

/**
 * Popup a modal with rule settings (e.g. metadata to include).
 */
export function settingsModal() {
    if (window.currentlyLoadedRule === undefined) {
        modals.popupErrorModal("No rule loaded!", "Cannot edit settings without loading a rule first!");
        return;
    }

    let modalCallbacks = [];

    // Generate the General form container.
    let generalFormContainer = settingsGenerateGeneralFormContainer();

    // Generate the Metadata form container.
    let metaFormContainer = settingsGenerateMetaFormContainer();

    // Add necessary form callback to callbacks list.
    modalCallbacks.push(metaSettingsFormCallback, metaSettingsFormAddRowCallback);

    let header = `<h2><i class="fa fa-cog"></i> Settings</h2>`;

    let bodyMiddle =
        `<h3>General</h3><br/>` +
        `${generalFormContainer.outerHTML}` +
        `<h3>Metadata</h3><br/>` +
        `${metaFormContainer.outerHTML}`;

    let saveAllSettingsButton = createElementAndSetAttributes("button", {
        "id": SETTINGS_MODAL_SAVE_ALL_BUTTON,
        "class": "btn btn-primary btn-large btn-success btn-block",
        "title": "Save all settings",
        "value": "Save all settings"
    });

    saveAllSettingsButton.innerText = "Save Changes";

    let footer = saveAllSettingsButton.outerHTML;

    modalCallbacks.push(saveAllSettingsButtonCallback);

    modals.popupModal(
        modals.RESPONSE_MODAL, header, null, bodyMiddle, null, footer,
        levels.INFO, modalCallbacks);
}

/**
 * Popup modal with methods for sharing current rule/state.
 */
export function shareStateModal() {
    console.log("Currently loaded rule", window.currentlyLoadedRule);
    // Gather state.
    // Ensure json is always defined.
    let json;
    try {
        // Attempt getting currently loaded rule from editor elements.
        let currentlyLoadedRule = getRuleJsonFromElements();

        // Assign JSON equal currentlyLoadedRule or empty JSON if currentlyLoadedRule is null/undefined.
        json = (currentlyLoadedRule) ? currentlyLoadedRule : {};
    } catch (e) {
        if (e.name === NO_CONTENTS_EXCEPTION) {
            console.warn(`${e.message}, Using currently loaded rule instead!`)
            json = currentlyLoadedRule;
        } else {
            // Log and display unexpected exception, then return.
            console.error(e.message, e.name);
            modals.popupErrorModal(e.name, e.message);

            return;
        }
    }
    console.log("shareStateModal json", json);

    // Base64 encode the JSON for use in URL.
    let encodedData = btoa(JSON.stringify(json));
    console.log("shareStateModal encodedData", encodedData);

    // Modal.
    let header = `<h2><i class="fa fa-share"></i> Share current rule/state (experimental!)</h2>`;

    let url = window.location.href;
    console.log("shareStateModal: url", url);

    let bodyMiddle =`<h3><a href="${url}">${url}</a></h3>`;

    modals.popupModal(modals.RESPONSE_MODAL, header, null, bodyMiddle, null, null,
        levels.INFO, null);
}

