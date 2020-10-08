import * as modals from "../modules/modals.js";

// MIME Types.
const MIMETYPE_JSON = 'application/json';
// Default placeholders.
const DEFAULT_STATUS_HEADER = "Processing GET request...";
const DEFAULT_STATUS_BODY = "Processing...";
const DEFAULT_STATUS_FOOTER = null;


export function fetchGetRequest(url, callback, callbackKwargs=null,
                                showStatusModal=false,
                                statusHeader=DEFAULT_STATUS_HEADER,
                                statusBody=DEFAULT_STATUS_BODY,
                                statusFooter=DEFAULT_STATUS_FOOTER) {
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    function json(response) {
        return response.json()
    }

    if (showStatusModal) {
        modals.popupStatusModal(statusHeader, statusBody, statusFooter);
    }

    fetch(url)
    .then(status)
    .then(json)
    .then(function(data) {
        if (showStatusModal) {
            // Close status modal.
            modals.closeModals();
        }

        // console.log(`fetchRequest succeeded with JSON response`, data);
        if (callbackKwargs == null) {
            callback(data);
        } else {
            callback(data, callbackKwargs)
        }
      }).catch(function(error) {
        console.log(`GET fetchRequest failed for URL '${url}'`, error); // TODO: Replace with error/log handlers, making func generic.
        // Append traceback (if any) to error modal.
        let tbString = error.stack ? `<br/><br/>Traceback:<br/><p>${error.stack}` : "";
        modals.popupErrorModal("fetchRequest failed!", // TODO: Replace with error/log handlers, making func generic.
            `${error}<hr/>URL: <a href="${url}">${url}</a>${tbString}</p>`);
      });
}

export async function fetchPostRequest(url = '', data = {}, callback, callbackKwargs=null,
                                       showStatusModal=false,
                                       statusHeader=DEFAULT_STATUS_HEADER,
                                       statusBody=DEFAULT_STATUS_BODY,
                                       statusFooter=DEFAULT_STATUS_FOOTER) { // FIXME: Unused (should probably replace XHRs)
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    function json(response) {
        return response.json()
    }

    if (showStatusModal) {
        modals.popupStatusModal(statusHeader, statusBody, statusFooter);
    }

    // Default options are marked with *
    await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': MIMETYPE_JSON
          // 'Content-Type': MIMETYPE_URL_ENCODED',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        .then(status)
        .then(json)
        .then(function(data) {
            console.log(`fetchPostRequest succeeded with JSON response`, data); // TODO: Replace with error/log handlers, making func generic.
            if (callbackKwargs == null) {
                callback(data);
            } else {
                callback(data, callbackKwargs)
            }
          }).catch(function(error) {
            console.log(`POST fetchRequest failed for URL '${url}'`, error);
            // Append traceback (if any) to error modal.
            let tbString = error.stack ? `<br/><br/>Traceback:<br/><p>${error.stack}` : "";
            modals.popupErrorModal("fetchPostRequest failed!",  // TODO: Replace with error/log handlers, making func generic.
            `${error}<hr/>URL: <a href="${url}">${url}</a>${tbString}</p>`);
          });
}