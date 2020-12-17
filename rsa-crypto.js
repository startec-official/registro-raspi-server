const NodeRSA = require('node-rsa');
const { encrypt } = require('./crypto');
const fs = require('fs');
var publicKey;
var privateKey;
var fileName;

var encryptData = ( data ) => {
  if( !isPublicKeySet() )
    setPublicKey();
  return publicKey.encrypt(data, 'base64');
}

var decryptData = ( cipherText ) => {
  try {
    return privateKey.decrypt( cipherText , 'utf8' ); 
  }
  catch(err) {
    return 'INCORRECT KEY';
  }
}

var setPublicKey = () => {
  try {
    publicKeyStream = fs.readFileSync( 'keys/public.pem' , 'utf8' );
    publicKey = new NodeRSA(publicKeyStream);
  }
  catch(fileError) {
    console.log('public key is missing...');
    throw fileError;
  }
}

var setPrivateKey = ( _filename ) => {
  try {
    fileName = _filename; // TODO : verify key here
    privateKeyStream = fs.readFileSync( `temp/${fileName}` , 'utf8' );
    privateKey = new NodeRSA(privateKeyStream);
  }
  catch(fileError) {
    console.log('private key is missing...');
    throw fileError;
  }
}

var deletePrivateKey = () => {
  try {
    fs.unlinkSync(`temp/${fileName}`);
    privateKey = undefined;
    fileName = undefined;
  }
  catch(fileError) {
    console.log('no private key set yet...');
  }
}

var clearTemp = () => {
  if(fs.existsSync('temp'))
    fs.rmdirSync('temp' , {recursive : true , force : true});
  fs.mkdirSync('temp');
}

var isPublicKeySet = () => {
  return publicKey != undefined;
}

var generateKeys = () => {
  var key = new NodeRSA().generateKeyPair();
  var publicKey = key.exportKey('pkcs8-public-pem');
  var privateKey = key.exportKey('pkcs1-pem');

  var dirName;  
  if( fs.readdirSync('keys').length > 0 ) {
    dirName = 'new_keys/';
  }
  else
    dirName = 'keys/';

  fs.writeFileSync( dirName + 'public.pem', publicKey, 'utf8');
  fs.writeFileSync( dirName + 'private.pem', privateKey, 'utf8');
}

module.exports.encryptData = encryptData;
module.exports.decryptData = decryptData;
module.exports.setPrivateKey = setPrivateKey;
module.exports.deletePrivateKey = deletePrivateKey;
module.exports.generateKeys = generateKeys;
module.exports.clearTemp = clearTemp;