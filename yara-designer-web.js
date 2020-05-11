require("dotenv").config();

const BIND_HOST = process.env.BIND_HOST;
const BIND_PORT = process.env.BIND_PORT;

const express = require('express');
const app = express();

app.get('/', function(req, res){
    res.sendFile(__dirname + '/src/index.html');
});


app.listen(BIND_PORT, BIND_HOST, () => console.log(`YARA Designer (frontend) app listening at http://${BIND_HOST}:${BIND_PORT}`));