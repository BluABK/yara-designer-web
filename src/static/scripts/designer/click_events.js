import {DESIGNER_EDITOR, LEFTPANE_DRAGGABLES, MOUSE_CLICK_MIDDLE, MOUSE_CLICK_RIGHT} from "../constants.js";
import {editYARAStringModal} from "./designer_modals.js";
import {makeClone} from "../modules/utils.js";
import {addElement, removeElement} from "./editor/common.js";



/**
 * onclick handler for conditional operator draggable elements.
 * @param clickEvent
 */
export function clickDraggableOperator(clickEvent) {
    // If target is already in the editor, ignore the click event.
    if (clickEvent.target.parentNode.getAttribute("id") === DESIGNER_EDITOR) {
        console.log("Ignored click event (target is child of editor div)", clickEvent);

        return;
    }

    addElement(clickEvent.target);
}

/**
 * onclick handler for observable (YARA String) draggable elements.
 * @param clickEvent
 */
export function clickDraggableYARAString(clickEvent) {
    console.log("clickDraggableYARAString", clickEvent);
    let targetParentID = clickEvent.target.parentNode.getAttribute("id");
    let editorDiv = document.getElementById(DESIGNER_EDITOR);

    if (targetParentID === DESIGNER_EDITOR) {
        // If target is in the editor.
        editYARAStringModal(clickEvent.target);
    } else if (LEFTPANE_DRAGGABLES.includes(targetParentID)) {
        // If target is in a left navbar draggable container.
        console.log('addToEditor', clickEvent.target);

        // Clone target separately in order to perform some post-actions on it.
        let clone = makeClone(clickEvent.target);

        // Make observable element clickable again (ev listeners are lost when cloning).
        clone.addEventListener('click', function(){ clickDraggableYARAString(event) });

        // Add cloned target to editor.
        editorDiv.appendChild(clone);
    } else {
        console.warn("Ignored click event (target is neither child of editor or draggables containers)",
            clickEvent);
    }

}

export function removeFromEditor(clickEvent) {
    // Only perform remove action if target is a child of editor div.
    if (clickEvent.target.parentNode.getAttribute("id") === DESIGNER_EDITOR) {
        removeElement(clickEvent.target);
    }
}

export function onAuxClick(auxClickEvent) {
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