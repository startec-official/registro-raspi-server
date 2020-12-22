const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

var remoteConnect = mysql.createConnection({
    host     : process.env.HOST_NAME,
    user     : process.env.DB_USER,
    password : process.env.password // TODO: hash the password 
});

var setConnectParams = () => {
    
};

module.exports = remoteConnect;