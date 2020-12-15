var dotenv = require('dotenv');
var express = require('express');
var routes = require('./routes');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use( '/' , routes);

app.listen( process.env.PORT , () => {
  console.log(`${process.env.APP_NAME} listening at http://${process.env.HOST_NAME}:${process.env.PORT}`)
});
