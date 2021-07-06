module.exports = {
    db: null,
    COLLECTION_CONFIG: 'configuration',
    init: function(firestore) {
        this.db = firestore
    },

    /**
     * Actualiza la configuración de la Notificación de positivos.
     * @param {object} notifyConfig JSON con los campos de la configuración a actualizar.
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    updateNotifyConfig: function(notifyConfig, success, fail) {
        this.db.collection(this.COLLECTION_CONFIG)
            .doc('notify-config')
            .set(notifyConfig, {merge: true}) // Actualizar campos + merge
            .then(docRef => {success(docRef)})
            .catch(error => {fail(error)})
    },

    /**
     * 
     * @param {object} riskContactConfig JSON con los campos de la configuración a actualizar. 
     * @param {callback} success 
     * @param {callback} fail 
     */
    updateRiskContactConfig: function(riskContactConfig, success, fail){
        this.db.collection(this.COLLECTION_CONFIG)
            .doc('risk-contact-config')
            .set(riskContactConfig, {merge: true}) // Actualizar campos + merge
            .then(docRef => {success(docRef)})
            .catch(error => fail(error))
    },

    /**
     * Devuelve la configuración correspondiente al fichero de configuración
     * cuyo nombre es pasado como parámetro.
     * @param {string} configFileName Nombre del fichero de configuración. 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    retrieveConfig: function(configFileName, success, fail) {
        this.db.collection(this.COLLECTION_CONFIG)
            .doc(configFileName)
            .get()
            .then(doc => {
                if(doc.exists){
                    success(doc.data())
                } else {
                    success({})
                }
            })
            .catch(error => {fail(error)})
    }

}