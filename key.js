// bring in the crypto module
const crypto = require ('node:crypto');

// use the generateKey to replace your secret
crypto.generateKey('hmac', { length: 512 }, (err,key) => {
    if (err) throw err;
    console.log(key.export().toString('hex'));
});

//Run the code to create the key