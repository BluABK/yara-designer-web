import { getParameterByName } from "./modules/utils.js";

// Global code
let themeParm = getParameterByName('theme');
const DEFAULT_THEME_PATH = "/static/themes/";

// Add event listeners.
document.querySelector('#load-theme-light-button').addEventListener('click', function(){ loadTheme('light') });
document.querySelector('#load-theme-dark-button').addEventListener('click', function(){ loadTheme('dark') });

function loadTheme(themeName, themePath=DEFAULT_THEME_PATH) {
    const rootEl = document.querySelector(':root');

    let themeFile = themeName + ".json";
    let themeFilePath = themePath + themeFile;

    // Load corresponding theme JSON from file.
    console.log("Load theme: " + themeFilePath);
    $.getJSON(themeFilePath, function(json) {
        // console.log(json); // this will show the info it in firebug console
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                // console.log("setProperty(" + key + ", " + json[key] + ")");
                rootEl.style.setProperty(key, json[key]);
            }
        }

    });
}

// Global code
if (themeParm !== null && themeParm !== "") {
    loadTheme(themeParm)
}