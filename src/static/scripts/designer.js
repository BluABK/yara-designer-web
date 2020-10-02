import {getParameterByName} from "./modules/utils.js";
import * as models from "./modules/models.js";
import {loadTheOracleRuleByFilename, loadDBRuleById, newRule} from "./designer/editor/rules.js";
import {
    OPERATOR_CONTAINER, YARA_STRING_EDITOR_ELEMENT_CONTAINER, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER,
    LEFTPANE_DRAGGABLES, DESIGNER_EDITOR
} from './constants.js';
import * as listeners from "./designer/listeners.js";
// Runs code in file which defines custom prototype functions and properties.
import "./designer/prototypes.js";

// Add event listeners.
listeners.addAll();

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
 * Determine currently loaded rule values from gathered values on the page.
 */
function computeCurrentlyLoadedRule() {
    // let computedRule = JSON.
    console.error("IMPLEMENT!");
}

// Global code
// Available URL Parameters:
let idParm = getParameterByName("id");
let filenameParm = getParameterByName("filename");
let stateParm = getParameterByName("state");

let tmpTest = {
    "strings": [
        {
            "identifier": "test_string_1",
            "modifier_str": "",
            "modifiers": ["nocase", "wide"],
            "str": "$test_string_1 = \"Test string 1\"",
            "string_type": "text",
            "value": "Test string 1",
            "value_type": "str"
        },
        {
            "identifier": "test_string_2",
            "modifier_str": "",
            "modifiers": [],
            "str": "$test_string_1 = \"Test string 2\"",
            "string_type": "text",
            "value": "Test string 2",
            "value_type": "str"
        }
    ]
}

console.log("tmpTest Base64", btoa(JSON.stringify(tmpTest)))

// Load rule by param, if given. Else create a new blank rule.
if (idParm !== null && idParm !== "") {
    console.log("Load rule: " + idParm);
    loadDBRuleById(idParm);
} else if (filenameParm !== null && filenameParm !== "") {
    console.log("Load rule: " + filenameParm);
    loadTheOracleRuleByFilename(filenameParm);
} else {
    // Load a default blank rule (sets various properties and models so we run into less issues).
    newRule();
}

// Handle state param:
if (stateParm !== null && stateParm !== "") {
    console.log("Loading state from URL...");
    console.log("state param base64", stateParm);
    let stateParmDecoded = JSON.parse(atob(stateParm));
    console.log("state param JSON", stateParmDecoded);
    // loadDBRuleById(idParm);
}

// Indicate that script ran through to the end during the initial load.
console.log("Ready.");

console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FIXME: TEST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
let ds = models.newDesignerState();
console.log("ds", ds);
let myJ = {"title": "This is a test."};
ds.fromPartialJson(myJ);
console.log("ds", ds);