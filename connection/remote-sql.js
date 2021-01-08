const mysql = require('mysql');
const dotenv = require('dotenv');
var fs = require('fs');

dotenv.config();

var _host , _user, _password;

var preRemoteConnection = mysql.createConnection({
    host     : _host,
    user     : _user,
    password : _password // TODO: hash the password 
});

var setParameters = () => {
    data = fs.openSync('host').toString().split('\n');
    _host = data[1];
    _user = data[2];
    _password = data[3];
}

var preCheck = function() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.database}.users (
      name VARCHAR(255) NOT NULL,
      age VARCHAR(255) NOT NULL,
      birthdate VARCHAR(255) NOT NULL,
      sex VARCHAR(255) NOT NULL,
      address VARCHAR(510) NOT NULL,
      phone_number VARCHAR(255) NOT NULL,
      datetime VARCHAR(255) NOT NULL
      )
    ENGINE = InnoDB;
    `;
    preRemoteConnection.query( `CREATE DATABASE IF NOT EXISTS ${process.env.database}_central;` , ( err , rows , fields ) => {
      if( err ) throw err;
      preRemoteConnection.query( createTableQuery , ( err , rows , fields ) => {
        if( err ) return err;
        console.log( rows );
      });
    });
  }
  
setParameters();
preCheck();

var remoteConnection = mysql.createConnection({
    host     : _host,
    user     : _user,
    password : _password, // TODO: hash the password 
    database : `${process.env.database}_central`
});

module.exports = remoteConnection;
module.exports.setParameters = setParameters;