/**
 * Repositorio para gestionar los valores de configuración del sistema.
 */
class ConfigRepository {

    constructor(db) {
        this.db = db // Referencia a Firestore
        this.COLLECTION_CONFIG = 'configuration'  // Nombre de la colección
    }

    /**
     * Actualiza la configuración de la Notificación de positivos.
     * @param {object} notifyConfig JSON con los campos de la configuración a actualizar.
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
     updateNotifyConfig(notifyConfig, success, fail) {
        this.db.collection(this.COLLECTION_CONFIG)
            .doc('notify-config')
            .set(notifyConfig, {merge: true}) // Actualizar campos + merge
            .then(docRef => {success(docRef)})
            .catch(error => {fail(error)})
    }

    /**
     * Actualiza la configuración de la comprobación de contactos de riesgo.
     * @param {object} riskContactConfig JSON con los campos de la configuración a actualizar. 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    updateRiskContactConfig(riskContactConfig, success, fail) {
        this.db.collection(this.COLLECTION_CONFIG)
            .doc('risk-contact-config')
            .set(riskContactConfig, {merge: true}) // Actualizar campos + merge
            .then(docRef => {success(docRef)})
            .catch(error => fail(error))
    }

    /**
     * Devuelve la configuración correspondiente al fichero de configuración
     * cuyo nombre es pasado como parámetro.
     * @param {string} configFileName Nombre del fichero de configuración. 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    retrieveConfig(configFileName, success, fail) {
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

module.exports = ConfigRepository