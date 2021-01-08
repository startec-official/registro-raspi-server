const { kdf } = require('crypto-js');
var express = require('express');
var fs = require('fs');
var router = express.Router();
var remoteConnection = require('../connection/remote-sql');

router.get('/get' , (req , res ) => {
    fs.stat('host',(err,stats)=>{
        if( stats != undefined ) {
            fs.readFile('host',(err,data)=>{
                if(err) {
                    res.sendStatus(500);
                    throw err;
                };
                const rawData = data.toString('utf8').split('\n');
                const _hostname = rawData[0];
                const _ip = rawData[1];
                res.json( { hostname : _hostname , ip : _ip } );
            });
        }
        else {
            res.sendStatus(500);
        }
    });
});

router.post( '/set' , (req,res) => {
    const hostname = req.body.hostname;
    const ip = req.body.ip;
    const user = req.body.user;
    const password = req.body.password;

    const writeData = `${hostname}\n${user}\n${ip}\n${password}`;
    fs.writeFile('host',writeData,'utf8',(err)=> {
        if(err) {
            res.sendStatus(500);
            throw err;
        }
        res.sendStatus(200);
    });
});

router.get('/blacklist/get', (req,res) => {
    new Promise((resolve,reject) => {
        remoteConnection.query('SELECT name,age,birthdate,sex,address FROM `blacklist`;',(err,rows,fields)=> {
            if (err) reject (err);
            resolve(rows);
        });
    }).then((rows) => {
        res.json(rows);
    }, (err) => {
        console.log(err);
        res.sendStatus(500);
        throw err;
    });
});

router.post('/upload' , (req,res)=> {
    // TODO: upload to remote database host here
    res.sendStatus(200);
});

router.get('/sayhi',(req,res)=>{
    // TODO: make test connection here
});

module.exports = router;