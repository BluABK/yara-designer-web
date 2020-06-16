const path = require("path");
const ejs = require("ejs");
require("dotenv").config();

const BIND_HOST = process.env.BIND_HOST;
const BIND_PORT = process.env.BIND_PORT;

const express = require('express');
const app = express();

// Prepare dotenv vars.
const baseUrl = process.env.BACKEND_HOST;


// Send in JavaScript vars from dotenv.
var ejsRenderedHtmlIndex;
ejs.renderFile(__dirname + '/static/index.html',
    {
        POST_RULE_ROUTE: `'${baseUrl}${process.env.POST_RULE_ROUTE}'`,
        POST_COMMIT_ROUTE: `'${baseUrl}${process.env.POST_COMMIT_ROUTE}'`,
        GET_RULES_ROUTE: `'${baseUrl}${process.env.GET_RULES_ROUTE}'`,
        GET_RULE_ROUTE: `'${baseUrl}${process.env.GET_RULE_ROUTE}'`,
        GET_THEORACLE_RULES_ROUTE: `'${baseUrl}${process.env.GET_THEORACLE_RULES_ROUTE}'`
    }, function(err, str) {
    // str => Rendered HTML string
    // console.log(str);
    ejsRenderedHtmlIndex = str;
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/static'));

app.use('/static', express.static(path.join(__dirname, '/static')));
app.use(express.static('/static/scripts/designer.js'), );


app.get('/', function(req, res){
    res.send(ejsRenderedHtmlIndex);
    // res.sendFile(__dirname + '/src/static/index.html');
});


app.listen(BIND_PORT, BIND_HOST, () => console.log(`YARA Designer (frontend) app listening at http://${BIND_HOST}:${BIND_PORT}`));