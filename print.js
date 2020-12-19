var ipp = require('ipp');
var PDFDocument = require('pdfkit');
var concat = require("concat-stream");
var mdns = require('mdns'),
    browser  = mdns.createBrowser(mdns.tcp('ipp'));

var testPrint = () => {
    var doc = new PDFDocument({margin:0});
    doc.text(".", 0, 0);

    doc.pipe(concat(function (data) {
        var printer = ipp.Printer("http://localhost:631/ipp/printer");
        var msg = {
            "operation-attributes-tag": {
                "requesting-user-name": "Bumblebee",
                "job-name": "whatever.pdf",
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

var findPrinters = () => {
	
    mdns.Browser.defaultResolverSequence[1] = 'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}); 
    
    browser.on('serviceUp', function (rec) {
        console.log(rec.name, 'http://'+rec.host+':'+rec.port+'/'+rec.txtRecord.rp);
    });
    browser.start();
}

findPrinters();