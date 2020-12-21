var CryptoJS = require("crypto-js");
var dotenv = require('dotenv');

dotenv.config();
 
var encrypt = ( message , key ) => {
    var ciphertext = CryptoJS.AES.encrypt( message, key ).toString();
    return ciphertext;
};

var decrypt = ( ciphertext , key ) => {
    var bytes  = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

var encryptTag = (message) => {
    console.log(`message: ${message}`);
    var key = makeRandom(process.env.key_char_count);
    console.log(`key: ${key}`);
    return CryptoJS.AES.encrypt( message , key ).toString().trim() + key.trim() + process.env.terminator;
}

var makeRandom = (lengthOfCode) => {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]=-)(*&^%$#@!~`";
    let text = '';
    for (let i = 0; i < lengthOfCode; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.encryptTag = encryptTag;