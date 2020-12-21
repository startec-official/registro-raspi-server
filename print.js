var ipp = require('ipp');
var PDFDocument = require('pdfkit');
var concat = require("concat-stream");
var mdns = require('mdns-js');
var fs = require('fs');
var lineReader = require('line-reader'),
    Promise = require('bluebird');

var printerName;

var generateDoc = ( printInfo ) => {
    console.log( printInfo );
    
}

var testPrint = () => {
    if( isSetPrinter ) {
        var doc = new PDFDocument({margin:0});
        doc.text(".", 0, 0);
        // TODO: replace with custom template doc
        doc.pipe(concat(function (data) {
            var printer = ipp.Printer(`http://localhost:631/ipp/printer/${printerName}`);
            var msg = {
                "operation-attributes-tag": {
                    "requesting-user-name": "Bumblebee",
                    "job-name": "  whatever.pdf",
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
        doc.end();
    }
    else {
        // TODO: error handling here
    }
}

var findPrinters = () => {
    return new Promise((resolve,reject) => {
        try {
            var printerNames = [];

            var eachLine = Promise.promisify(lineReader.eachLine);
            eachLine('test.txt', function(line) {
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
module.exports.generateDoc = generateDoc;