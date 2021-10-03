// Dependencias de test
let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../app.js')
let should = chai.should() // Tipo de aserción: Should
let di = require('../di/AppModule.js') // Inyección de dependencias

chai.use(chaiHttp) // Usar plugin Chai-http

// Datos de prueba
let notifyConfig = {
    infectivityPeriod: 5,
    notifyWaitTime: 6,
    positivesNotificationTime: "12:30"
}
let riskContactConfig = {
    exposeTimeWeight: 0.5,
    meanProximityWeight: 0.45,
    meanTimeIntervalWeight: 0.05,
    securityDistanceMargin: 5,
    timeDifferenceMargin: 15,
    exposeTimeRange: [0, 900000],
    meanProximityRange: [0, 10],
    meanTimeIntervalRange: [0, 600000]
}

describe('Configuration API', () => {
    // Before Each (Antes de cada test)
    beforeEach((done) => {
        // Cargar los datos de los ficheros de configuración
        di.configRepository().updateNotifyConfig(notifyConfig,
            (docRef) => {
                di.configRepository().updateRiskContactConfig(riskContactConfig,
                    (docRef) => done(),
                    (error) => console.log("Error al actualizar la configuración de positivos"))
            }, 
            (error) => console.log("Error al actualizar la configuración de positivos"))
    })

    // Recuperación de la configuración
    describe('/GET configuration', () => {

        it('[APIC1] Recuperar la configuración de un fichero que no existe, debería devolver 404', (done) => {
            chai.request(app)
                .get('/config/no-existe')
                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
        })

        it('[APIC2] Debería devolver la configuración de la notificación de positivos', (done) => {
            chai.request(app)
                .get('/config/notify-config')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('infectivityPeriod').equal(5)
                    res.body.should.have.property('notifyWaitTime').equal(6)
                    res.body.should.have.property('positivesNotificationTime').equal("12:30")
                    done()
                })
        })

        it('[APIC3] Debería devolver la configuración de la comprobación de contactos de riesgo', (done) => {
            chai.request(app)
                .get('/config/risk-contact-config')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('exposeTimeWeight').equal(0.5)
                    res.body.should.have.property('meanProximityWeight').equal(0.45)
                    res.body.should.have.property('meanTimeIntervalWeight').equal(0.05)
                    res.body.should.have.property('securityDistanceMargin').equal(5)
                    res.body.should.have.property('timeDifferenceMargin').equal(15)
                    res.body.should.have.property('exposeTimeRange').eql([0, 900000])
                    res.body.should.have.property('meanProximityRange').eql([0, 10])
                    res.body.should.have.property('meanTimeIntervalRange').eql([0, 600000])
                    done()
                })
        })
    })

    // Actualización de la configuración
    describe('/POST configuration', () => {
        it('[APIC4] Actualizar la configuración con un fichero vacío o sin enviar datos, debería devolver 400 Bad Request', (done) => {
            let empty = {}
            chai.request(app)
                .post('/config/updateNotifyConfig')
                .send(empty)
                .end((err, res) => {
                    res.should.have.status(400)
                    // Comprobar que no se ha modificado la configuración
                    chai.request(app)
                        .get('/config/notify-config')
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('infectivityPeriod').equal(5)
                            res.body.should.have.property('notifyWaitTime').equal(6)
                            res.body.should.have.property('positivesNotificationTime').equal("12:30")
                            done()
                        })
                })
        })

        it('[APIC5] Actualizar la configuración de la notificación, debería devolver 200 y actualizar la configuración', (done) => {
            let newConfig = {
                infectivityPeriod: 10,
                notifyWaitTime: 7,
                positivesNotificationTime: "22:56"
            }
            chai.request(app)
                .post('/config/updateNotifyConfig')
                .send(newConfig)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('updated').eql(true)
                    res.body.should.have.property('msg').eql("Configuración actualizada correctamente.")
                    // Comprobar que no se ha modificado la configuración
                    chai.request(app)
                        .get('/config/notify-config')
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('infectivityPeriod').equal(10)
                            res.body.should.have.property('notifyWaitTime').equal(7)
                            res.body.should.have.property('positivesNotificationTime').equal("22:56")
                            done()
                        })
                })
        })

        it('[APIC6] Actualizar la configuración de la comprobación, debería devolver 200 y actualizar la configuración', (done) => {
            let newConfig = {
                exposeTimeWeight: 0.2,
                meanProximityWeight: 0.4,
                meanTimeIntervalWeight: 0.4,
                securityDistanceMargin: 7,
                timeDifferenceMargin: 5,
                exposeTimeRange: [0, 900500],
                meanProximityRange: [0, 15],
                meanTimeIntervalRange: [0, 600500]
            }
            chai.request(app)
                .post('/config/updateRiskContactConfig')
                .send(newConfig)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('updated').eql(true)
                    res.body.should.have.property('msg').eql("Configuración actualizada correctamente.")
                    // Comprobar que no se ha modificado la configuración
                    chai.request(app)
                        .get('/config/risk-contact-config')
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('exposeTimeWeight').equal(0.2)
                            res.body.should.have.property('meanProximityWeight').equal(0.4)
                            res.body.should.have.property('meanTimeIntervalWeight').equal(0.4)
                            res.body.should.have.property('securityDistanceMargin').equal(7)
                            res.body.should.have.property('timeDifferenceMargin').equal(5)
                            res.body.should.have.property('exposeTimeRange').eql([0, 900500])
                            res.body.should.have.property('meanProximityRange').eql([0, 15])
                            res.body.should.have.property('meanTimeIntervalRange').eql([0, 600500])
                            done()
                        })
                })
        })

    })
})