var dotenv = require('dotenv');
var express = require('express');

var print = require('../utils/printer');

dotenv.config();

var router = express.Router();

router.get( '/printers' , (req,res)=>{
    try {
        print.findPrinters().then((data) => {
            res.json(data);
        },
        (error) => {
            throw error;
        });
    }
    catch(e) {
        res.sendStatus({status: 500});
    }
});

router.post( '/set/:newPrinter' , (req,res) => {
    const newPrinter = req.params.newPrinter.toString().trim();
    try {
        print.setPrinter( newPrinter );
        res.sendStatus(200);
    }
    catch( e ) {
        res.sendStatus(500);
        throw e;
    }
});

router.post('/send' , (req,res) => {
    try {
        print.generateQR(req.body).then((qrStream) => {
            print.attachQRToDocument(qrStream,req.body).then((doc) => {
                print.printDocument(doc).then(() => {
                    res.sendStatus(200);
                });
            }) 
        });
    }
    catch(e) {
        res.sendStatus(500);
        throw e;
    }
});

module.exports = router;