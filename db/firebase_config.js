module.exports = {
    
    config_firebase: function() {
        const fbAdmin = require('firebase-admin')
        const fbServiceAccount = require('./contacttracker-admin-sdk.json')
        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(fbServiceAccount)
        })
        return fbAdmin.firestore()
    }
}