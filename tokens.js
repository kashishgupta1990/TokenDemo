var crypto = require('crypto');

module.exports.InvalidTokenDataError = function () {
    throw "Data is invalid Exception";
};

module.exports.InvalidTokenError = function () {
    throw "Token is Invalid";
};

module.exports.generateToken = function (data,cryptoSecret,HMACSecret) {

    //Checking Data Validation
    if(typeof data.userId == "string" && typeof data.expiry == "number" && typeof data.scope == "object")
    {
        console.log("Data is valid.");
    }
    else
    {
        this.InvalidTokenDataError();
    }

    //Converting Data into JSON
    var dJSON = JSON.stringify(data);

    //Creating HMAC KEY
    var payloadHMAC = crypto.createHmac('sha1', HMACSecret).update(dJSON).digest('base64');

    var payload = dJSON +"|||"+ payloadHMAC;
    var payload64 = new Buffer(payload).toString('base64');

    var cryptextObj = crypto.createCipher('aes192', cryptoSecret);
    var cryptoUpdate = cryptextObj.update(payload64,'base64','base64');
    var cryptext = cryptoUpdate + cryptextObj.final('base64');

    var rawCryptext = cryptext +"."+ data.userId+"."+crypto.createHmac('sha1', HMACSecret).update(cryptext).digest('base64');

    return new Buffer(rawCryptext).toString('base64');
};

module.exports.parseToken = function (cryptext,cryptoSecret,HMACSecret) {

    //console.log(cryptext);
    var UNDOrawBase64 = new Buffer(cryptext,'base64').toString('utf8');
    var raw = UNDOrawBase64.split('.');

    console.log("User-ID: " + raw[1]);
    //console.log("digest: " + raw[2]);
    //console.log("digest: "+crypto.createHmac('sha1', HMACSecret).update(raw[0]).digest('base64'));

    if(raw[2]==crypto.createHmac('sha1', HMACSecret).update(raw[0]).digest('base64')) {

        var decryptObj = crypto.createDecipher('aes192', cryptoSecret);
        var decrytUpdate = decryptObj.update(raw[0], 'base64', 'base64');
        var decrypttext = decrytUpdate + decryptObj.final('base64');
        var newpayload = new Buffer(decrypttext, 'base64').toString('utf8').split('|||');

        //Checking HMAC VALUE
        var decrypttext;
        if (newpayload[1] == crypto.createHmac('sha1', HMACSecret).update(newpayload[0]).digest('base64')) {
            decrypttext = JSON.parse(newpayload[0]);

            var tokenGenerateDateTime = new Date(decrypttext.expiry);
            var currentDateTime = new Date();

            if (tokenGenerateDateTime <= currentDateTime) {
                throw this.InvalidTokenError();
            }
        }
        else {
            throw "Token Temper Exception";
        }
    }
    else
    {
        throw this.InvalidTokenError();
    }
    return decrypttext;
};

