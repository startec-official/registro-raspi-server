var connection = require('../connection/mysql');
var dotenv = require('dotenv');

var express = require('express');
var moment = require('moment');

var rsaCrypto = require('../utils/rsa-crypto');

const converter = require('json-2-csv');
var multer = require('multer');
var upload = multer({ dest : 'temp/' });

const ifaces = require('os').networkInterfaces();

dotenv.config();

var router = express.Router();


router.post( '/save' , ( req , res) => {
    new Promise((resolve,reject) => {
        var userData = [];
        for( var property in req.body ) {
            req.body[property] = rsaCrypto.encryptData( req.body[property].toString() );
        }
        var datetime = moment().format().toString();
        var encryptedDateTime = rsaCrypto.encryptData( datetime );
        userData.push( [ req.body.name , req.body.age , req.body.birthdate , req.body.sex, req.body.address , req.body.phoneNumber , encryptedDateTime ] ); // TODO : switch to for loop
        // TODO: create query generator from file
        const query = `
            INSERT INTO users (
                name,
                age,
                birthdate,
                sex,
                address,
                phone_number,
                datetime
            )
            VALUES ?
        `;
        connection.query( query , [userData] , (err,rows,fields) => {
            if( err ) reject(err);
            resolve();
        });
    }).then(() => res.sendStatus(200), 
            (error)=> {
                console.log(error);
                res.sendStatus(405);
            });
});

router.post('/upload' , upload.single('fileKey') , (req,res)=>{
    new Promise((resolve,reject) => {
        rsaCrypto.setPrivateKey( req.file.filename );
        resolve();
    }).then(
        () => {
            res.sendStatus(200);
        },
        (err) => {
            res.sendStatus(500);
            throw err;
        }
    );
});

router.get( '/download/encrypted' , (req , res ) => { // TODO: leanify code // TODO: make more efficient
    new Promise( (resolve,reject) => {
        // test key validity
        const query = 'SELECT * FROM `users`';
        connection.query( query , (err,rows,fields) => {
            if( err ) reject(err);
            if ( rsaCrypto.decryptData(rows[0].name) == 'INCORRECT KEY' ) // TODO : better failure condition
                reject( 'INCORRECT KEY...' );
            resolve( rows );
        });
    }).then(( rows ) => {
        let users = [];
        for (let i = 0; i < rows.length; i++) {
            let newObject = {};
            for( var property in rows[i] ) {
                newObject[property] = rsaCrypto.decryptData( rows[i][property].toString() );
            }
            users.push(newObject);
        }
        rsaCrypto.deletePrivateKey();
        res.header('Content-Type', 'text/csv');
        res.attachment('users.csv');

        converter.json2csv(users, (err, csv) => {
            if (err) {
                throw err;
            }
            res.send( csv );
        });
    } , 
      (error) => {
          console.log( error );
          rsaCrypto.deletePrivateKey();
          res.sendStatus(500);
    });
});

router.get( '/download/raw' , ( req, res ) => {
    new Promise( (resolve,reject) => {
        // test key validity
        const query = 'SELECT * FROM `users`';
        connection.query( query , (err,rows,fields) => {
            if( err ) reject(err);
            resolve( rows );
        });
    }).then(( rows ) => {
        let users = [];
        for (let i = 0; i < rows.length; i++) {
            let newObject = {};
            for( var property in rows[i] ) {
                newObject[property] = rows[i][property].toString();
            }
            users.push(newObject);
        }
        res.header('Content-Type', 'text/csv');
        res.attachment('users_raw.csv');

        converter.json2csv(users, (err, csv) => {
            if (err) {
                throw err;
            }
            res.send( csv );
        });
    } , 
      (error) => {
          console.log( error );
          res.sendStatus(500);
    });
});

router.post('/generate' , (req , res) => {
    new Promise((resolve,reject)=>{
        try {
            rsaCrypto.generateKeys();
            resolve();
        }
        catch( err ) {
            console.log(err);
            reject(err);
        }
    }).then(()=>{
        res.sendStatus(200);
    },
    (err)=>{
        console.log(err);
        res.sendStatus(500);
    });
});

router.get( '/ip' , (req,res) => {
    var address;
  
    try {
        Object.keys(ifaces).forEach(dev => {
            ifaces[dev].filter(details => {
                if (details.family === 'IPv4' && details.internal === false) {
                address = details.address;
                }
            });
        });
        res.send(address);
    }
    catch(e) {
        res.sendStatus(500);
    }
});

module.exports = router;