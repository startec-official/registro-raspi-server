const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

var connectToRemoteHost = ( _ip , _user , _password ) => {
    return new Promise((resolve,reject) => {
        try {
            var remoteConnect = mysql.createConnection({
                host     : _ip,
                user     : _user,
                password : _password // TODO: hash the password 
            });
            resolve( remoteConnect );
        }
        catch(e) {
            reject(e);
        }
    });
};

module.exports.connectToRemoteHost = connectToRemoteHost;