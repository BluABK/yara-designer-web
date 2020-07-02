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
 * Function call example:
 *  window.history.replaceState('', '', updateURLParameter(window.location.href, param, paramVal));
 *
 * Based on: https://stackoverflow.com/a/10997390/13519872
 * @param url
 * @param param
 * @param paramVal
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

        if(anchor) {
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
                // Append the modified param.
                updatedParamArray.push(`${param}=${paramVal}`)
            } else {
                // Append the unmodified param.
                updatedParamArray.push(paramArray[i]);
            }
        }

        if (!paramAlreadyExists) {
            // If param did not already exist, append it to the array.
            updatedParamArray.push(`${param}=${paramVal}`)
        }

        if (updatedParamArray.length > 1) {
            // If there are multiple, return baseURL with params joined by separator.
            return `${baseURL}?${updatedParamArray.join('&')}`;
        } else {
            // Else return baseURL with a single param.
            return `${baseURL}?${updatedParamArray[0]}`;
        }
    } else {
        // If URL doesn't have any current parameters:
        if(params) {
            baseURL = params;
        }

        return `${baseURL}?${param}=${paramVal}`;
    }
}