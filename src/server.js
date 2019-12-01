
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//initialize routes
routes(app);
module.exports = app;