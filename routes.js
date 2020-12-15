var express = require('express');
var connection = require('./mysql');
var dotenv = require('dotenv');
var crypto = require('./crypto');
var moment = require('moment');
const converter = require('json-2-csv');

dotenv.config();

var router = express.Router();

router.post( '/save' , ( req , res) => {
    new Promise((resolve,reject) => {
        var userData = [];
        for( var property in req.body ) {
            req.body[property] = crypto.encrypt( req.body[property].toString() , process.env.password ).toString();
        }
        var datetime = moment().format().toString();
        var encryptedDateTime = crypto.encrypt( datetime , process.env.password ).toString();
        userData.push( [ req.body.name , req.body.age , req.body.birthdate , req.body.sex, req.body.address , req.body.phoneNumber , encryptedDateTime ] );
        // TODO: encrypt data here
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

router.get( '/download' , (req , res ) => { // TODO: leanify code
    // serve file as spread sheet
    new Promise( (resolve,reject) => {
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
                // TODO: use a token / session key to decrypt
                newObject[property] = crypto.decrypt( rows[i][property].toString() , process.env.password );
            }
            // TODO: save file here 
            users.push(newObject);
        }
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
          res.send('CANNOT DOWNLOAD DATA...');
    });
});

module.exports = router;