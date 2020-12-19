var ipp = require('ipp');
var PDFDocument = require('pdfkit');
 
//make a PDF document
var doc = new PDFDocument({margin:0});
doc.text(".", 0, 780);
 
doc.output(function(pdf){
    var printer = ipp.Printer("http://localhost/ipp/printer");
    var msg = {
        "operation-attributes-tag": {
            "requesting-user-name": "Startec",
            "job-name": "My Test Job",
            "document-format": "application/pdf"
        },
        data: pdf
    };
    printer.execute("Print-Job", msg, function(err, res) {
        console.log(res);
    });
});