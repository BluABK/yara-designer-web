import {createElementAndSetAttributes, uuidv4} from "../modules/utils.js";
import * as yara from "../modules/yara.js";
import {setTitle} from "./editor/common.js";

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

/**
 * Generates a "fake" row with label headings (in order to avoid reprinting labels for every single row)
 *
 * @returns {HTMLElement}   The generated "fake" row heading.
 */
export function generateYARAStringModifierFormRowHeading() {
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

export function generateYARAStringModifierFormRows() {
    let formModifierRows = [];
    let dataInputValue = "";

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
            "value": dataInputValue,
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

export function generateCustomYARAStringBuilderForm() {
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
    identifierColumnLabel.innerText = "Identifier (Leave blank for MD5)";
    let identifierColumnInput = createElementAndSetAttributes("input", {
        "class": "form-control",
        "id": identifierColumnInputId,
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
    let formModifierRows = generateYARAStringModifierFormRows();


    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    form.appendChild(formRow1);
    form.appendChild(formRow2);
    form.appendChild(generateYARAStringModifierFormRowHeading());
    for (let row of formModifierRows) {
        form.appendChild(row);
    }

    return form;
}

/**
 * Populates values for the YARA String Editor modal form.
 *
 * (NB: must be called after modal has already been spawned)
 *
 * @param identifierColumnValue
 * @param valueColumnValue
 * @param valueTypeColumnValue
 * @param stringTypeColumnValue
 * @param modifiers
 */
export function setYARAStringFormValues(identifierColumnValue=null, valueColumnValue=null, valueTypeColumnValue=null,
                                 stringTypeColumnValue=null, modifiers=null) {
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
    if (modifiers == null) {
        modifiers = [];
    }

    // Set data for columns.
    document.getElementById(
        `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-identifier`).value = identifierColumnValue;
    document.getElementById(
        `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-value`).value = valueColumnValue;
    document.getElementById(
        `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-value-type`).value = valueTypeColumnValue;
    document.getElementById(
        `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-string-type`).value = stringTypeColumnValue;

    // Set enabled modifiers (and possible payload data).
    for (let modifier of modifiers) {
        // Check that checkbox!
        document.getElementById(
            `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-modifier-checkbox-${modifier.keyword}`).checked = true;

        // Set payload data if applicable.
        if (yara.YARA_MODIFIERS_WITH_PAYLOAD.includes(modifier)) {
            document.getElementById(
                `${ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN}-modifiers-data-input-${modifier.keyword}`).value = modifier.data;
        }
    }
}

/**
 * Generates a form element for editing, adding and removing metadata to include in the rule.
 *
 * @returns {HTMLElement}
 */
export function settingsGenerateGeneralForm() {
    // Define the form element to hold items.
    let form = createElementAndSetAttributes("form", {
        "id": SETTINGS_MODAL_GENERAL_FORM,
        "style": "line-height: 0;"  // Reduce some vertical spacing (alas, not near enough).
    });

    // Define required row structure.
    let formRow = createElementAndSetAttributes("div", {
        // Set a GUID/UUID instead of index to avoid issues with del/add row feature (id collisions).
        "id": `general-form-row-${uuidv4()}`,
        "class": "form-row"
    });

    // -- COLUMN: Identifier.
    let titleColumnInputId = SETTINGS_MODAL_GENERAL_FORM_COLUMN_TITLE_INPUT;
    let titleColumn = createElementAndSetAttributes("div", {
        "class": "col-md-12"
    });
    let titleColumnLabel = createElementAndSetAttributes("label", {
        "for": titleColumnInputId,
    });
    titleColumnLabel.innerText = "Title";
    let titleColumnInput = createElementAndSetAttributes("input", {
        "class": "form-control",
        "id": titleColumnInputId,
        "value": window.currentlyLoadedRule.title
    });

    // Add label and input element to column and finally column to row.
    titleColumn.appendChild(titleColumnLabel);
    titleColumn.appendChild(titleColumnInput);
    formRow.appendChild(titleColumn);

    // Add row to form.
    form.appendChild(formRow);

    return form;
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
export function settingsGenerateGeneralFormContainer() {
    let container = createElementAndSetAttributes("div", {});

    // Generate the form element for metadata.
    let form = settingsGenerateGeneralForm();

    // Add form to container.
    container.appendChild(form);

    return container;
}

/**
 * Overwrite currently loaded rule's meta with what is listed in the settings form.
 */
export function saveGeneralSettings() {
    let title = document.getElementById(SETTINGS_MODAL_GENERAL_FORM_COLUMN_TITLE_INPUT).value;

    window.currentlyLoadedRule.title = title;
    window.currentlyLoadedRule.name = yara.sanitizeIdentifier(title);
    setTitle(title, window.currentlyLoadedRule.thehive_case_id, window.currentlyLoadedRule.description);
}

export function addMetaFormDeleteCurrentRowButtonEventListeners(selector) {
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
export function metaSettingsFormAddRowCallback() {
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
export function metaSettingsFormCallback(modal) {
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
export function generateMetaFormRowHeading() {
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

export function generateMetaFormRow(identifierColumnValue=null, valueColumnValue=null, valueTypeColumnValue=null, idSuffix=null) {
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
export function settingsGenerateMetaForm() {
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
export function settingsGenerateMetaFormContainer() {
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