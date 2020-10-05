/**
 * YARA-Designer ExpressJS server.
 */

// Import and set up dependencies.
const path = require("path");
const ejs = require("ejs");
const express = require('express');
const app = express();
require("dotenv").config();

// Define globals.
const INDEX_RELATIVE_PATH = '/static/index.html';

// Define globals from dotenv file.
const BIND_HOST = process.env.BIND_HOST;
const BIND_PORT = process.env.BIND_PORT;
const BACKEND_HOST = process.env.BACKEND_HOST;

// Set up sub path, if not defined make it an empty string so it can be used in string operations.
const SUB_PATH = process.env.SUB_PATH ? process.env.SUB_PATH : "";

// Send in JavaScript vars from dotenv.
var ejsRenderedHtmlIndex;
ejs.renderFile(__dirname + INDEX_RELATIVE_PATH,
    {
        // NB: Any variable you want to use in EJS *MUST* first be declared here.
        SUB_PATH: `${SUB_PATH}`,
        POST_RULE_ROUTE: `'${BACKEND_HOST}${process.env.POST_RULE_ROUTE}'`,
        POST_COMMIT_ROUTE: `'${BACKEND_HOST}${process.env.POST_COMMIT_ROUTE}'`,
        GET_RULES_ROUTE: `'${BACKEND_HOST}${process.env.GET_RULES_ROUTE}'`,
        GET_RULE_ROUTE: `'${BACKEND_HOST}${process.env.GET_RULE_ROUTE}'`,
        GET_THEORACLE_RULES_ROUTE: `'${BACKEND_HOST}${process.env.GET_THEORACLE_RULES_ROUTE}'`,
        GET_THEORACLE_RULE_ROUTE: `'${BACKEND_HOST}${process.env.GET_THEORACLE_RULE_ROUTE}'`
    }, function(err, str) {
    if (err) {
        console.error(err);
    }
    // str => Rendered HTML string (uncomment for debug assistance).
    // console.log(str);
    ejsRenderedHtmlIndex = str;
});

// Instruct ExpressJS to use view engine: ejs.
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Set views.
app.set('views', path.join(__dirname, '/static'));

// Create and use new middleware functions to serve files from within given root directories.
app.use(`/${SUB_PATH}static`, express.static(path.join(__dirname, '/static')));

// Create a route to render the index file.
app.get(`/${SUB_PATH}`, function(req, res){
    // Serve the EJS-rendered HTML index file.
    res.send(ejsRenderedHtmlIndex);
});

// Start ExpressJS server.
app.listen(BIND_PORT, BIND_HOST, () => console.log(`YARA Designer (frontend) app running on http://${BIND_HOST}:${BIND_PORT}/${SUB_PATH}`));