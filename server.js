var dotenv = require('dotenv');
var express = require('express');
var routes = require('./routes');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var rsaCrypto = require('./rsa-crypto');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use( '/' , routes);

rsaCrypto.clearTemp(); // ensure temp is empty if server unexpectedly fails

app.listen( process.env.PORT , () => {
  console.log(`${process.env.APP_NAME} listening at http://${process.env.HOST_NAME}:${process.env.PORT}`)
});
