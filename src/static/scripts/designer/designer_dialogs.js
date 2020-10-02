import {setTags, addNumericElementToEditor} from "./editor/common.js";

export function popupAddNumericElementDialog() {
    let numberInputString = prompt("Enter integer number", "");
    console.log("numberInputString", numberInputString);

    if (numberInputString !== null && numberInputString !== "") {
        let number = parseInt(numberInputString);

        if (!isNaN(number)) {
            addNumericElementToEditor(number);
        }
    }
}

export function popupAddTagDialog() {
    let newTag = prompt("Enter tag name", "");
    console.log("newTag", newTag);

    if (newTag !== null && newTag !== "") {
        window.currentlyLoadedRule.tags.push(newTag);
        setTags(window.currentlyLoadedRule.tags);
    }
}