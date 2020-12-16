const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

var preConnect = mysql.createConnection({
  host     : process.env.HOST_NAME,
  user     : process.env.DB_USER,
  password : process.env.password
});

var preCheck = function() {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${process.env.database}.users (
    name VARCHAR(255) NOT NULL,
    age VARCHAR(50) NOT NULL,
    birthdate VARCHAR(50) NOT NULL,
    sex VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    datetime VARCHAR(255) NOT NULL
    )
  ENGINE = InnoDB;
  `;
  preConnect.query( `CREATE DATABASE IF NOT EXISTS ${ process.env.database };` , ( err , rows , fields ) => {
    if( err ) throw err;
    connection.query( createTableQuery , ( err , rows , fields ) => {
      if( err ) return err;
      console.log( rows );
    });
  });
}

preCheck();

var connection = mysql.createConnection({
  host     : process.env.HOST_NAME,
  user     : process.env.DB_USER,
  password : process.env.password,
  database : process.env.database
});

module.exports = connection;