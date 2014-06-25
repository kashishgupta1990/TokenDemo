//Require the module (The one you will build)
var tokens = require("./tokens.js");

//Define keys
var cryptoSecret = "822180f014c3ebf76160765162959adf74162bc72c4cc50eb55be397da36b37542a561346e2c35e6b1bad4fc18c1a07c38399398fbe97f7c8f12b95a9484aed1";
var hmacSecret = "a846328b28a2148d1bee236c16e97596e6f9fc572bb84de684ff82c9a6561c011fdcc8e640309534210542fb6f2962b01da4bb85d991d046c39e21cbc90a8028";

//Define the user token data
var data = {
    userId: "238763342",
    scope: ["read", "write", "admin"], //Full rights
    expiry: +new Date() + 30000 //30 seconds from generation
};

console.log(data);

//Build Token
var token = tokens.generateToken(data, cryptoSecret, hmacSecret);

/* DECODE TOKEN */
var decodedData = tokens.parseToken(token, cryptoSecret, hmacSecret);

console.log(decodedData);