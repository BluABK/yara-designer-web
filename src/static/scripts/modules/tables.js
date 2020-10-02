import {CUSTOM_TABLE_CLASS} from "../constants.js";
import {containsHtmlComment, getHtmlCommentData} from "./utils.js";

/**
 * Generates a (nicely formatted/indented) HTML <TABLE> based on a list of header:column maps.
 *
 * @param id                    (Unique) ID for <TABLE>.
 * @param headerContentMaps     List of header:column maps (e.g. [{"title": "a title}].
 * @param className             (Unique) class name for <TABLE>.
 *
 * @returns {string}            Generated HTML <TABLE>.
 */
export function makeTable(id, headerContentMaps, className = CUSTOM_TABLE_CLASS) {
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

export function getCellValue(tr, idx) {
    return tr.children[idx].innerText || tr.children[idx].textContent;
}

export function comparer(idx, asc) {
    return function(a, b) { return function(v1, v2) {
        return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
    }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
}}