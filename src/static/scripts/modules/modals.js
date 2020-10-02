/**
 * Modal definitions and generic code that can be easily reused.
 **/

import * as levels from "./levels.js";

// CSS Vars:
export const CSS_VAR_PREFIX = "--";

// Modals:
export const MODAL_CLASS = "custom-modal";
export const MODAL_CONTENT_CLASS = `${MODAL_CLASS}-content`;
export const MODAL_HEADER = "header";
export const MODAL_HEADER_CONTENT = `${MODAL_HEADER}-content`;
export const MODAL_BODY = "body";
export const MODAL_BODY_TOP = `${MODAL_BODY}-top`;
export const MODAL_BODY_MIDDLE = `${MODAL_BODY}-middle`;
export const MODAL_BODY_BOTTOM = `${MODAL_BODY}-bottom`;
export const MODAL_FOOTER = "footer";
export const MODAL_CLOSE = "close";
export const MODAL_BG = "modal-background";
export const MODAL_TEXT_COLOR = "modal-color";
export const MODAL_DEFAULT_HEADER = "";
export const MODAL_DEFAULT_BODY = "";
export const MODAL_DEFAULT_BODY_TOP = "";
export const MODAL_DEFAULT_BODY_MIDDLE = "";
export const MODAL_DEFAULT_BODY_BOTTOM = "";
export const MODAL_DEFAULT_FOOTER = "<p>Tip: Click anywhere outside of this modal to close.</p>";
export const MODAL_DEFAULT_CONFIRMATION_HEADER = "<h2>Are you sure?</h2>";
export const MODAL_DEFAULT_CONFIRMATION_BODY = "";
export const MODAL_DEFAULT_CONFIRMATION_BODY_TOP = "";
export const MODAL_DEFAULT_CONFIRMATION_BODY_MIDDLE = "";
export const MODAL_DEFAULT_CONFIRMATION_BODY_BOTTOM = "";
export const MODAL_DEFAULT_CONFIRMATION_FOOTER = MODAL_DEFAULT_FOOTER;

export const RESPONSE_MODAL = "response-modal";
export const RESPONSE_MODAL_HEADER = `${RESPONSE_MODAL}-${MODAL_HEADER}`;
export const RESPONSE_MODAL_BODY = `${RESPONSE_MODAL}-${MODAL_BODY}`;
export const RESPONSE_MODAL_FOOTER = `${RESPONSE_MODAL}-${MODAL_FOOTER}`;
export const RESPONSE_MODAL_BUTTON = `${RESPONSE_MODAL}-button`;
export const RESPONSE_MODAL_BUTTON_COMMIT = `${RESPONSE_MODAL_BUTTON}-commit-onclick`;
export const RESPONSE_MODAL_BUTTON_COMMIT_CLASS = `${RESPONSE_MODAL_BUTTON}-commit`;
export const RESPONSE_MODAL_BUTTON_COMMIT_DISABLED_CLASS = `${RESPONSE_MODAL_BUTTON_COMMIT_CLASS}-disabled`;
export const RESPONSE_MODAL_BUTTON_JSON_COLLAPSIBLE_CLASS = `${RESPONSE_MODAL_BUTTON}-json-collapsible`;
export const RESPONSE_MODAL_JSON_COLLAPSIBLE_CONTENT_CLASS = `${RESPONSE_MODAL}-json-collapsible-content`;

export const CONFIRMATION_MODAL = "confirmation-modal";
export const CONFIRMATION_MODAL_HEADER = `${CONFIRMATION_MODAL}-${MODAL_HEADER}`;
export const CONFIRMATION_MODAL_BODY = `${CONFIRMATION_MODAL}-${MODAL_BODY}`;
export const CONFIRMATION_MODAL_FOOTER = `${CONFIRMATION_MODAL}-${MODAL_FOOTER}`;
export const CONFIRMATION_MODAL_BUTTON = `${CONFIRMATION_MODAL}-button`;
export const CONFIRMATION_MODAL_BUTTON_YES = `${CONFIRMATION_MODAL_BUTTON}-yes-onclick`;
export const CONFIRMATION_MODAL_BUTTON_YES_CLASS = `${CONFIRMATION_MODAL_BUTTON}-yes`;
export const CONFIRMATION_MODAL_BUTTON_NO = `${CONFIRMATION_MODAL_BUTTON}-no-onclick`;
export const CONFIRMATION_MODAL_BUTTON_NO_CLASS = `${CONFIRMATION_MODAL_BUTTON}-no`;

// Get the modals
let modals = [];
let modalIds = [RESPONSE_MODAL, CONFIRMATION_MODAL];
for (let i = 0; i < modalIds.length; i++ ) {
    // Add modals by-id.
    modals.push(document.getElementById(modalIds[i]));

   // Add close logic.
   let closeCustomModal = document.getElementById(`${modalIds[i]}-${MODAL_CLOSE}`); //[i];

   // When the user clicks on <span> (x), close (hide) the modal
   document.getElementById(`${modalIds[i]}-${MODAL_CLOSE}`).onclick = function() {
     document.getElementById(modalIds[i]).style.display = "none";
   };

   // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        for (let i = 0; i < modalIds.length; i++) {
            if (event.target === document.getElementById(modalIds[i])) {
                document.getElementById(modalIds[i]).style.display = "none";
            }
        }
    };
}

/**
 * Convenience: Shortens the line width when getting a CSS variable.
 */
function getCSSVar(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(`${CSS_VAR_PREFIX}${varName}`);
}

/**
 * Shows a pop-up modal with customisable header, footer and body,
 * as well as background color based on level.
 *
 * level: String that is appended to CSS variables:
 *  - '-modal-background-*'
 *  - '-modal-color-*'
 */
export function popupModal(modalId=null, header=null, bodyTop=null, bodyMiddle=null, bodyBottom=null, footer=null,
                           level=null, callbacks=null) {
    // Modal element itself.
    let modal = document.getElementById(modalId);

    // Reset any custom resizing or other modal-content classList modifications.
    modal.getElementsByClassName(MODAL_CONTENT_CLASS)[0].className = MODAL_CONTENT_CLASS;

    // Modal sub-elements.
    let modalHeader = document.getElementById(`${modalId}-${MODAL_HEADER}`);
    let modalHeaderContent = document.getElementById(`${modalId}-${MODAL_HEADER_CONTENT}`);
    // let modalBody = document.getElementById(`${modalId}-${MODAL_BODY}`);
    console.log("modalBodyTop", `${modalId}-${MODAL_BODY_TOP}`);
    let modalBodyTop = document.getElementById(`${modalId}-${MODAL_BODY_TOP}`);
    let modalBodyMiddle = document.getElementById(`${modalId}-${MODAL_BODY_MIDDLE}`);
    let modalBodyBottom = document.getElementById(`${modalId}-${MODAL_BODY_BOTTOM}`);
    let modalFooter = document.getElementById(`${modalId}-${MODAL_FOOTER}`);

    // Set level (if null, set to info/default).
    level = (level != null) ? level : levels.INFO;

    // Set sub-element values, if given.
    modalHeaderContent.innerHTML = (header != null) ? header: MODAL_DEFAULT_HEADER;
    // modalBody.innerHTML  = (body != null) ? body : MODAL_DEFAULT_BODY;
    modalBodyTop.innerHTML  = (bodyTop != null) ? bodyTop : MODAL_DEFAULT_BODY_TOP;
    modalBodyMiddle.innerHTML  = (bodyMiddle != null) ? bodyMiddle : MODAL_DEFAULT_BODY_MIDDLE;
    modalBodyBottom.innerHTML  = (bodyBottom != null) ? bodyBottom : MODAL_DEFAULT_BODY_BOTTOM;
    modalFooter.innerHTML = (footer != null) ? footer :  MODAL_DEFAULT_FOOTER;

    // Set custom style.
    //      Header.
    modalHeader.style.background = getCSSVar(`${MODAL_BG}-${level}`);
    modalHeader.style.color = getCSSVar(`${MODAL_TEXT_COLOR}-${level}`);
    //      Footer.
    modalFooter.style.background = getCSSVar(`${MODAL_BG}-${level}`);
    modalFooter.style.color = getCSSVar(`${MODAL_TEXT_COLOR}-${level}`);

    // Perform any callbacks on the spawned modal.
    if (Array.isArray(callbacks)) {
        for (let cb of callbacks) {
            cb(modal);
        }
    }

    // Show modal.
    modal.style.display = "block";

    // Return the modal to be easily used by caller.
    return modal;
}

export function popupWarningModal(header, body, footer=null) {
    let hdr = `<h2>Warning: ${header}</h2>`;
    let bdy = `<h3>${body}</h3>`;

    popupModal(RESPONSE_MODAL, hdr, null, bdy, null, footer, levels.WARNING);
}

export function popupErrorModal(header, body, footer=null) {
    let hdr = `<h2>Error: ${header}</h2>`;
    let bdy = `<h3>${body}</h3>`;

    popupModal(RESPONSE_MODAL, hdr, null, bdy, null, footer, levels.ERROR);
}

/**
 * Perform an action given by JSON object.
 * @param actionObj
 */
export function performAction(actionObj) {
    if ( actionObj.hasOwnProperty("action") ) {
        // Apply arguments (if defined).
        if (actionObj.hasOwnProperty("args")) {
            if (actionObj.args.length > 0) {
                // Perform action with arguments.
                actionObj.action(...actionObj.args);
            } else {
                console.error("performAction was given actionObj with empty arguments list!", actionObj)
            }
        } else {
            // Perform action without arguments.
            actionObj.action();
        }
    } else {
        console.error("performAction was given actionObj with no action key!", actionObj)
    }
}

/**
 * Perform multiple actions given by a list of JSON objects.
 * @param actionsObj
 */
export function performActions(actionsObj) {
    if ( Array.isArray(actionsObj) ) {
        // Perform actions.
        for (let actionObj of actionsObj) {
            performAction(actionObj);
        }
    } else {
        throw Error(`performActions only takes Array type (got: '${typeof actionsObj}'!`);
    }
}


/**
*   Adds Yes/No confirmation buttons to a custom modal and binds actions to them.
*/
export function popupConfirmationModal(yesActions, noAction=undefined,
                                body=MODAL_DEFAULT_CONFIRMATION_BODY,
                                header=MODAL_DEFAULT_CONFIRMATION_HEADER,
                                footer=MODAL_DEFAULT_CONFIRMATION_FOOTER,
                                level=levels.WARNING) {

    // Append bindable buttons to custom body.
    let bodyMiddle = body;
    bodyMiddle += `<button id="${CONFIRMATION_MODAL_BUTTON_YES}" class="${CONFIRMATION_MODAL_BUTTON_YES_CLASS}">Yes</button>`;
    bodyMiddle += `<button id="${CONFIRMATION_MODAL_BUTTON_NO}" class="${CONFIRMATION_MODAL_BUTTON_NO_CLASS}">No</button>`;

    // Spawn modal.
    popupModal(CONFIRMATION_MODAL, header, null, bodyMiddle, null, footer, level);

    // Add bindings to buttons.
    document.getElementById(CONFIRMATION_MODAL_BUTTON_YES).onclick = function() {
        yesActions && performActions(yesActions);

        // Close modal.
        document.getElementById(CONFIRMATION_MODAL).style.display = "none";
    };
    document.getElementById(CONFIRMATION_MODAL_BUTTON_NO).onclick = function() {
        // Perform bound action (if defined).
        noAction && noAction();

        // Close modal after handling button action.
        document.getElementById(CONFIRMATION_MODAL).style.display = "none";
    };
}

export function popupHelpModal() {
    let header = "<h2>How To Use</h2>";
    let bodyMiddle =
            "<h4>Adding items</h4>" +
            "<p>Either click on or drag items from the left-pane to add them to the editor." + "<br/>" +
            "<i>NB: Drag and drop won't work until you've added at least one item to the editor.</i></p>" +
            // "<p></p>" +

            "<h4>Removing items</h4>" +
            "<p>Middle mouse-click on an item in the editor to remove it.</p>"+

            "<h4>Tags</h4>" +
            "<p>Check the checkboxes for which tags you want to include (if any).</p>";

    popupModal(RESPONSE_MODAL, header, null, bodyMiddle, null, null, levels.INFO);
}

/**
 * Closes any open modals.
 */
export function closeModals() {
    for ( let modalElement of document.getElementsByClassName(MODAL_CLASS) ) {
        if (modalElement.style.display !== "none") {
            console.log("Closed open modal: " + modalElement.id);
            modalElement.style.display = "none";
        }
    }
}