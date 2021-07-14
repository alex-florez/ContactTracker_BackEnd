/**
 * Inicializa y configura una instancia de firebase 
 * mediante el Admin SDK.
 * @returns Instancia de Admin de Firebase.
 */
exports.config_firebase = function() {
        const fbAdmin = require('firebase-admin')
        const fbServiceAccount = require('./contacttracker-admin-sdk.json')
        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(fbServiceAccount)
        })
        return fbAdmin.firestore()
}