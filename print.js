var ipp = require('ipp');
var PDFDocument = require('pdfkit');
var concat = require("concat-stream");
var crypto = require('./utils/crypto');
var dotenv = require('dotenv');
var fs = require('fs');
var qr = require('qr-image');
var lineReader = require('line-reader'),
    Promise = require('bluebird');

dotenv.config();

var printerName;

var generateQR = ( printInfo ) => {
    return new Promise((resolve,reject) => {
        try {
            var plaintext = '';
            for( property in printInfo )
                plaintext += printInfo[property] + process.env.delimiter;
            plaintext = plaintext.substring(0,plaintext.length-1);
            const finalText = crypto.encryptTag( plaintext );
            var qrStream = qr.imageSync( finalText , { type: 'png' });
            resolve(qrStream);
        }
        catch(e) {
            reject(e);
        }
    });
}

var attachQRToDocument = (qrStream,user) => {
    return new Promise((resolve,reject) => {
        try {
            var doc = new PDFDocument({margin: 0});
            doc.image('id-layout/id-layout.png', {width: 209.764, height: 297.638});
            doc.fontSize(10);
            doc.font('Helvetica-Bold');
            doc.text(user.name.toString().trim().toUpperCase() , 28.3465 , 10.34646 , {
                width: 155.906,
                align: 'center'
                }
            );
            doc.fontSize(6);
            doc.font('Helvetica');
            doc.text(user.address.toString().trim().toUpperCase() , 28.3465 , 43.93701 , {
                width: 155.906,
                align: 'center'
                }
            );
            doc.image(qrStream, 28.3465, 87.874, {width: 155.906, height: 155.906});
            doc.end();
            resolve(doc);
        }
        catch(e) {
            reject(e);
        }
    });
}

var printDocument = (doc) => {
    return new Promise((resolve,reject) => {
        if( isSetPrinter ) {
            try {
                doc.pipe(concat(function (data) {
                    console.log(`Printer Name: ${printerName}`);
                    var printer = ipp.Printer(`http://localhost:631/printers/${printerName}`);
                    var msg = {
                        "operation-attributes-tag": {
                            "requesting-user-name": "Startec",
                            "job-name": 'qr-print.pdf',
                            "document-format": "application/pdf"
                        },
                        "job-attributes-tag":{
                    "media-col": {
                        "media-source": "tray-2"
                    }
                        }
                        , data: data
                    };
                    printer.execute("Print-Job", msg, function(err, res){
                        console.log(err);
                        console.log(res);
                    });
                }));
                resolve();
            }
            catch(err) {
                reject();
            }
        }
        else {
            reject();
        }
    });
}

var findPrinters = () => {
    return new Promise((resolve,reject) => {
        try {
            var printerNames = [];

            var eachLine = Promise.promisify(lineReader.eachLine);
            eachLine('/etc/cups/printers.conf', function(line) {
                if(line.includes('<Printer ')) {
                    printerNames.push( line.replace('<Printer ','').replace('>','').trim() );
                }
            }).then(function() {
            resolve(printerNames);
            }).catch(function(err) {
            console.error(err);
            });
        }
        catch(e) {
            reject(e);
        }
    });
}

var isSetPrinter = () => {
    const availablePrinters = findPrinters();
    // if there's only one printer, set that one up as the default
    if(availablePrinters.length > 0 )
        printerName = availablePrinters[0];
        return printerName == undefined;
}

var setPrinter = ( newPrinter ) => {
    printerName = newPrinter;
}

module.exports.findPrinters = findPrinters;
module.exports.setPrinter = setPrinter;
module.exports.generateQR = generateQR;
module.exports.attachQRToDocument = attachQRToDocument;
module.exports.printDocument = printDocument;