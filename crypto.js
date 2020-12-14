var CryptoJS = require("crypto-js");
 
var encrypt = ( message , key ) => {
    var ciphertext = CryptoJS.AES.encrypt( message, key ).toString();
    return ciphertext;
};

var decrypt = ( ciphertext , key ) => {
    var bytes  = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
