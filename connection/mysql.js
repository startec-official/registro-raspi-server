const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

var preConnect = mysql.createConnection({
  host     : process.env.HOST_NAME,
  user     : process.env.DB_USER,
  password : process.env.password // TODO: hash the password 
});

var preCheck = function() {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${process.env.database}.users (
    name VARCHAR(${process.env.padding}) NOT NULL,
    age VARCHAR(${process.env.padding}) NOT NULL,
    birthdate VARCHAR(${process.env.padding}) NOT NULL,
    sex VARCHAR(${process.env.padding}) NOT NULL,
    address VARCHAR(${process.env.padding * 2}) NOT NULL,
    phone_number VARCHAR(${process.env.padding}) NOT NULL,
    datetime VARCHAR(${process.env.padding}) NOT NULL
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