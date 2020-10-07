import {getRules, getRulesDB, loadObservablesHandler, clearRule, getAdditionalRules} from "./editor/rules.js";
import {addYARAStringToEditorModal, settingsModal, shareStateModal} from "./designer_modals.js";
import {popupHelpModal} from "../modules/modals.js";
import {popupAddNumericElementDialog, popupAddTagDialog} from "./designer_dialogs.js";
import {fetchPostRequest} from "./requests.js";
import {getRuleJsonFromElements} from "./editor/common.js";
import {clickDraggableOperator, onAuxClick} from "./click_events.js";
import {DESIGNER_EDITOR, VAR_COUNT_KEYWORD} from "../constants.js";
import {handlePostRuleResponse} from "./handlers.js";
import {NO_CONTENTS_EXCEPTION} from "../modules/exceptions.js";
import * as modals from "../modules/modals.js";

export function addAll() {
    // Add event listeners.
    // -- Buttons:
    document.querySelector('#load-rule-button').addEventListener('click', function() { getRules(getAdditionalRules) });
    document.querySelector('#load-observables-button').addEventListener('click', function() { getRulesDB(loadObservablesHandler); });
    document.querySelector('#edit-settings-button').addEventListener('click', settingsModal);
    document.querySelector('#add-yara-string-button').addEventListener('click', addYARAStringToEditorModal);
    document.querySelector('#show-help-button').addEventListener('click', popupHelpModal);
    document.querySelector('#share-button').addEventListener('click', shareStateModal);
    document.querySelector('#add-numeric-element-button').addEventListener('click', function(){ popupAddNumericElementDialog() });
    document.querySelector('#clear-rule-button').addEventListener('click', clearRule);
    document.querySelector('#submit-rule-button').addEventListener('click', function() {
        let rule;
        try {
            console.log("Parsing designed rule from editor elements...")
            rule = getRuleJsonFromElements();

            console.log("Submitting parsed rule to backend...", rule);
            fetchPostRequest(POST_RULE_ROUTE, rule, handlePostRuleResponse, null, true,
                "Submit designed rule", "Processing...").then();
        } catch (e) {
            if (e.name === NO_CONTENTS_EXCEPTION) {
                console.warn(e.message, e.name);
                modals.popupWarningModal(e.message, "Please add contents to the editor before submitting.");
            } else {
                console.error(e.message, e.name);
                modals.popupErrorModal(e.name, e.message);
            }
        }
    });
    document.querySelector('#add-tags-button').addEventListener('click', function(){ popupAddTagDialog() });

    // -- Draggables:
    // -- -- Operators
    // -- -- -- Boolean:
    document.querySelector('#condition-keyword-and').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-or').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-not').addEventListener('click', function(){ clickDraggableOperator(event) });
    // -- -- -- Arithmetic:
    document.querySelector('#condition-keyword-equal').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-lt').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-gt').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-leq').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-geq').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-neq').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector(`#${VAR_COUNT_KEYWORD}`).addEventListener('click', function(){ clickDraggableOperator(event) });
    // -- -- -- Relational:
    document.querySelector('#condition-keyword-add').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-sub').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-mul').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-div').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-pct').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-setminus').addEventListener('click', function(){ clickDraggableOperator(event) });
    // -- -- -- Bitwise:
    document.querySelector('#condition-keyword-bitwise-and').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-bitwise-or').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-bitwise-not').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-bitwise-xor').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-bitwise-lshift').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-bitwise-rshift').addEventListener('click', function(){ clickDraggableOperator(event) });
    // -- -- -- Parenthesis and wrappers:
    document.querySelector('#condition-keyword-lparen').addEventListener('click', function(){ clickDraggableOperator(event) });
    document.querySelector('#condition-keyword-rparen').addEventListener('click', function(){ clickDraggableOperator(event) });

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
}