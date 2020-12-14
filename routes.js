const express = require('express');
var connection = require('./mysql');

var router = express.Router();

router.post( '/save' , ( req , res) => {
    new Promise((resolve,reject) => {
        var userData = [];
        userData.push( [ req.body.name , req.body.age , req.body.birthdate , req.body.sex.toString().substring(0,1), req.body.address , req.body.phoneNumber ] );
        // TODO: encrypt data here
        const query = `
            INSERT INTO users (
                name,
                age,
                birthdate,
                sex,
                address,
                phone_number
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

module.exports = router;