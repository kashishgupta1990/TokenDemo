var tokens = require("./tokens.js");
var crypto = require('crypto');
var buffer = require('buffer');

var data = {
    userId: "238763342",
    scope: ["read", "write", "admin"], //Full rights
    expiry: +new Date() + 30000 //30 seconds from generation
};

tokens.generateToken(data,"","");

var dJSON = JSON.stringify(data);
var HMACSecret =  "a846328b28a2148d1bee236c16e97596e6f9fc572bb84de684ff82c9a6561c011fdcc8e640309534210542fb6f2962b01da4bb85d991d046c39e21cbc90a8028";
var cryptoSecret = "822180f014c3ebf76160765162959adf74162bc72c4cc50eb55be397da36b37542a561346e2c35e6b1bad4fc18c1a07c38399398fbe97f7c8f12b95a9484aed1";

//console.log(dJSON);

//Creating HMAC KEY
var payloadHMAC = crypto.createHmac('sha1', HMACSecret).update(dJSON).digest('base64');
var payload = dJSON +"|||"+ payloadHMAC;
console.log(payload);
var payload64 = new Buffer(payload).toString('base64');
console.log(payload64);
var cryptextObj = crypto.createCipher('aes192', cryptoSecret);
var cryptoUpdate = cryptextObj.update(payload64,'base64','base64');
var cryptext = cryptoUpdate + cryptextObj.final('base64');
//console.log(cryptext);

//Decoding
var decryptObj = crypto.createDecipher('aes192', cryptoSecret);
var decrytUpdate = decryptObj.update(cryptext,'base64','base64');
var decrypttext =decrytUpdate + decryptObj.final('base64');
console.log(decrypttext);
var newpayload = new Buffer(decrypttext,'base64').toString('utf8').split('|||');

//Checking HMAC VALUE
var decrypttext;
if(newpayload[1]==crypto.createHmac('sha1', HMACSecret).update(dJSON).digest('base64'))
{
    decrypttext = JSON.parse(newpayload[0]);
}
else
{
    //Temper Data
}





/*
console.log(typeof data.userId == "string");
console.log(typeof data.expiry == "number");
console.log(typeof data.scope == "object");*/
