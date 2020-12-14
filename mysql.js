const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

var connection = mysql.createConnection({
  host     : process.env.HOST_NAME,
  user     : process.env.DB_USER,
  password : process.env.password,
  database : process.env.database
});

module.exports = connection;