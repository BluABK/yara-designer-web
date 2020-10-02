import {NUMBERED_TEXTBOX_CLASS, TEXT_COLOR_GREEN_CLASS, TEXT_COLOR_RED_CLASS} from "../constants.js";

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function makeClone(node) {
    // console.log("makeClone", node);
    let clone;

    // Returns a copy of node. If deep is true, the copy also includes the node's descendants.
    clone = node.cloneNode(true);

    node.parentNode.insertBefore(clone, node);

    return clone;
}

/**
 * Update the address bar URL parameters.
 *
 * To remove a param from the URL simply supply paramVal as null or undefined.
 *
 * Function call example:
 *  window.history.replaceState('', '', updateURLParameter(window.location.href, param, paramVal));
 *
 * Based on: https://stackoverflow.com/a/10997390/13519872
 * @param url
 * @param param
 * @param paramVal      If null or undefined; remove the param from URL.
 * @returns {string}
 */
export function updateURLParameter(url, param, paramVal) {
    let baseURL = url.split("?")[0];
    let paramsURL = url.split("?")[1];
    let anchor = paramsURL ? paramsURL.split("#")[1]: null;
    let params = baseURL.split("#")[0];

    if (paramsURL) {
        // If URL has any current parameters:
        let updatedParamArray = [];

        if(anchor && paramVal) {
            paramsURL = paramsURL.split("#")[0];
            paramVal += "#" + anchor;
        }

        // Iterate through the array of parameters, in order to update param in-place.
        let paramAlreadyExists = false;
        let paramArray = paramsURL.split("&");
        for (let i = 0; i < paramArray.length; i++) {
            let curParam = paramArray[i].split('=')[0];

            if(curParam === param) {
                paramAlreadyExists = true;

                if (paramVal) {
                    // Append the modified param, else omit it as null paramVal indicates we want it gone.
                    updatedParamArray.push(`${param}=${paramVal}`)
                } else {
                    // Push null to avoid issues with length check not triggering.
                    updatedParamArray.push(null);
                }
            } else {
                // Append the unmodified param.
                updatedParamArray.push(paramArray[i]);
            }
        }

        if (!paramAlreadyExists) {
            if (paramVal) {
                // If param did not already exist, append it to the array.
                updatedParamArray.push(`${param}=${paramVal}`)
            } else {
                // Push null to avoid issues with length check not triggering.
                updatedParamArray.push(null);
            }
        }

        if (updatedParamArray.length > 1) {
            // If there are multiple, return baseURL with params joined by separator.
            let updatedParamArrayWithoutNullValues = updatedParamArray.filter(x => x !== null);

            return `${baseURL}?${updatedParamArrayWithoutNullValues.join('&')}`;
        } else {
            if (paramVal) {
                // Return baseURL with a single param.
                return `${baseURL}?${updatedParamArray[0]}`;
            } else {
                // If paramVal is null and there is only one param,
                // there are actually no params, so we'll return baseURL.
                return baseURL;
            }
        }
    } else {
        // If URL doesn't have any current parameters:
        if(params) {
            baseURL = params;
        }

        if (paramVal) {
            // Return baseURL with a single param.
            return `${baseURL}?${param}=${paramVal}`;
        } else {
            // If paramVal is null, return baseURL as we don't want to set any params by mistake.
            return baseURL;
        }
    }
}

/**
 * Converts troublesome characters to HTML-compliant symbols.
 *
 * @param unsafe        String containing unsafe characters.
 * @returns {string}    String with unsafe characters converted to HTML-compliant symbols.
 */
export function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
  });
}

/**
 * Sets multiple attributes on a HTMLDomElement.
 *
 * @param HTMLDomElement
 * @param attrJSON
 */
export function setAttributes(HTMLDomElement, attrJSON) {
    for (let key of Object.keys(attrJSON)) {
        HTMLDomElement.setAttribute(key, attrJSON[key]);
    }
}

/**
 * Combine createElement and setting attributes into one function (significantly lessens code bloat).
 *
 * @param tagName
 * @param attrJSON
 *
 * @returns {HTMLElement}
 */
export function createElementAndSetAttributes(tagName, attrJSON) {
    let HTMLDomElement = document.createElement(tagName);

    setAttributes(HTMLDomElement, attrJSON);

    return HTMLDomElement;
}

export function containsNonSeparatorChar(s) {
    for (let i = 0; i < s.length; i++) {
        let c = s[i];
        if (c !== '\n' && c !== '\t'&& c !== '' && c !== ' ') {
            return true;
        }
    }

    return false;
}

/**
 * Makes a ISO8601 datetime string more human readable.
 *
 * @param isoDateString     "YYYY-MM-DDTHH:MM:SS.f"
 * @returns {string}        "YYYY-MM-DD HH:MM:SS"
 */
export function humanizeISODate(isoDateString) {
    let date = isoDateString.split('T')[0];
    let time = isoDateString.split('T')[1].split('.')[0];

    return `${date} ${time}`;
}

export function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
        return typeof obj[Symbol.iterator] === 'function';
}

// noinspection JSUnusedLocalSymbols
/**
 * Takes a string and returns a boolean of whether it's a HTML comment.
 *
 * @param s
 */
export function isHtmlComment(s) {
    return ( s.startsWith("<!--") && s.endsWith("-->") );
}

export function printGitLogEntry(hexSha, authorUsername, authorEmail, dateString, msg) {
    return `<span>
                commit ${hexSha}<br/>
                Author: ${authorUsername} &lt;<a href="mailto:${authorEmail}">${authorEmail}</a>&gt;<br/>
                Date: &nbsp;&nbsp; ${dateString}<br/>
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;${msg}
            </span>`;
}

export function printGitDiff(diffString, color=true) {
    if (diffString === "") {
        return "<p>There were no differences between this and the previous commit.</p>"
    }

    let retv = `<pre class='${NUMBERED_TEXTBOX_CLASS}'>`;

    if (color) {
        for (let line of diffString.split('\n')) {
            if (line.startsWith("+")) {
                retv += `<span><mark class='${TEXT_COLOR_GREEN_CLASS}'>${line}</mark>\n</span>`
            } else if (line.startsWith("-")) {
                retv += `<span><mark class='${TEXT_COLOR_RED_CLASS}'>${line}</mark>\n</span>`
            }
            else {
                retv += `<span>${line}\n</span>`;
            }
        }
    } else {
        for (let line of diffString.split('\n')) {
            retv += `<span>${line}</span>`
        }
    }
        retv += "</pre>";

    return retv;
}

/**
 * Clears an element by setting its innerHTML to "".
 *
 * @param elementID
 */
export function clearElement(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

/**
 * Takes a string and returns a boolean of whether contains a HTML comment.
 *
 * @param s
 */
export function containsHtmlComment(s) {
    const regex = /<!--.*-->/g;
    return s.search(regex) !== -1;
}

/**
 * Takes a string and returns the substring in-between the HTML comment delimiters.
 *
 * @param s
 */
export function getHtmlCommentData(s) {
    const regex = /<!--(.*)-->/;

    // Return the second item which is the 1st capturing group,
    // (the first group entry is the complete match).
    return s.match(regex)[1].toString();
}
