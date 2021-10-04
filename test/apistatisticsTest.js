// Dependencias de Test
let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../app.js')
let should = chai.should() // Tipo de aserción: should
let di = require('../di/AppModule.js') // Inyección de dependencias

chai.use(chaiHttp)

describe('Statistics API', () => {
    // Before each (antes de cada Test)
    beforeEach((done) => {
        // Eliminar positivos
        di.positiveRepository().deleteAllPositives(() => {
            // Eliminar estadísticas
            di.statisticsRepository().deleteAllStatistics(() => {
                 // Rellenar positivos
                 let positives = getTestPositives()
                 di.positiveRepository().addPositive(positives[0], (docRef) => {
                    di.positiveRepository().addPositive(positives[1], (docRef) => {
                        di.positiveRepository().addPositive(positives[2], (docRef) => {
                            di.positiveRepository().addPositive(positives[3], (docRef) => {
                                // Rellenar instalaciones
                                let installations = getTestInstallations()
                                di.statisticsRepository().registerNewInstall(installations[0], (dr) => {
                                    di.statisticsRepository().registerNewInstall(installations[1], (dr) => {
                                        di.statisticsRepository().registerNewInstall(installations[2], (dr) => {
                                            di.statisticsRepository().registerNewInstall(installations[3], (dr) => {
                                               // Rellenar resultados
                                               let results = getTestResults()
                                               di.statisticsRepository().registerRiskContactResult(results[0], (dr) => {
                                                    di.statisticsRepository().registerRiskContactResult(results[1], (dr) => {
                                                        di.statisticsRepository().registerRiskContactResult(results[2], (dr) => {
                                                            done()
                                                        }, null)
                                                    }, null)
                                               }, null)
                                            }, null)
                                        }, null)
                                    }, null)
                                }, null)
                            }, (error) => {console.log("Error al insertar el positivo.")})
                        }, (error) => {console.log("Error al insertar el positivo.")})
                    }, (error) => {console.log("Error al insertar el positivo.")})
                }, (error) => console.log("Error al insertar el positivo."))
            })
        })
    })

    // Registrar estadísticas
    describe('/POST statistic', () => {
        it('[APIS1] Registrar instalación con un objeto vacío, debería devolver 400 Bad request', (done) => {
            chai.request(app)
                .post('/statistics/registerInstall')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400)
                    // Comprobar instalaciones
                    let targetDate = Date.parse("2021-09-30 12:00:00")
                    let numDays = 5
                    chai.request(app)
                        .get(`/statistics/installs/${targetDate}/${numDays}`)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.have.property('installCount').eql(4)
                            done()
                        })
                })
        })

        it('[APIS2] Registrar instalación con un objeto correcto, debería devolver 200 OK', (done) => {
            chai.request(app)
                .post('/statistics/registerInstall')
                .send({
                    timestamp: Date.parse("2021-09-29 13:13:00")
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('registered').eql(true)
                    res.body.should.have.property('msg').eql("Instalación registrada.")
                    // Comprobar instalaciones
                    let targetDate = Date.parse("2021-09-30 12:00:00")
                    let numDays = 5
                    chai.request(app)
                        .get(`/statistics/installs/${targetDate}/${numDays}`)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.have.property('installCount').eql(5)
                            done()
                        })
                })
        })

        it('[APIS3] Registrar un resultado de una comprobación enviando un objeto vacío, debería devolver 400 Bad request', (done) => {
            chai.request(app)
                .post('/statistics/registerCheckResult')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400)
                    // Comprobar resultados
                    let targetDate = Date.parse("2021-10-01 12:00:00")
                    let numDays = 5
                    chai.request(app)
                        .get(`/statistics/checks/${targetDate}/${numDays}`)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.have.property('checkCount').eql(3)
                            res.body.should.have.property('risk').eql(44.82)
                            res.body.should.have.property('exposeTime').eql(7700)
                            res.body.should.have.property('proximity').eql(2.588)
                            done()
                        })
                })
        })

        it('[APIS4] Registrar un resultado de una comprobación enviando un resultado correcto, debería devolver 200 OK', (done) => {
            chai.request(app)
                .post('/statistics/registerCheckResult')
                .send({
                    exposeTime: 4000,
                    proximity: 2.55,
                    riskPercent: 60.50,
                    timestamp: Date.parse("2021-09-29 13:13:00")
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('registered').eql(true)
                    res.body.should.have.property('msg').eql("Resultado de la comprobación registrado.")
                    // Comprobar resultados 
                    let targetDate = Date.parse("2021-10-01 12:00:00")
                    let numDays = 5
                    chai.request(app)
                        .get(`/statistics/checks/${targetDate}/${numDays}`)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.have.property('checkCount').eql(4)
                            res.body.should.have.property('risk').eql(48.74)
                            res.body.should.have.property('exposeTime').eql(6775)
                            res.body.should.have.property('proximity').eql(2.578)
                            done()
                        })
                })
        })
    })

    // Recuperar estadísticas
    describe('/GET statistic', () => {
        it('[APIS5] Recuperar estadísticas de positivos, instalaciones y resultados cuando no existen datos filtrados en los últimos días', (done) => {
            let targetDate = Date.parse("2021-10-05 12:55:04")
            let numDays = 2
            chai.request(app)
                .get(`/statistics/positives/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('positiveCount').eql(0)
                    res.body.should.have.property('asymptomaticCount').eql(0)
                    res.body.should.have.property('vaccinatedCount').eql(0)
                    done()
                })
        })

        it('[APIS6] Recuperar estadísticas de positivos notificados en el día de hoy', (done) => {
            let targetDate = Date.parse("2021-09-26 12:00:00")
            let numDays = 0
            chai.request(app)
                .get(`/statistics/positives/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('positiveCount').eql(1)
                    res.body.should.have.property('asymptomaticCount').eql(0)
                    res.body.should.have.property('vaccinatedCount').eql(1)
                    done()
                })
        })

        it('[APIS7] Recuperar estadísticas de resultados de comprobación registrados en el día de hoy', (done) => {
            let targetDate = Date.parse("2021-09-26 12:00:00")
            let numDays = 0
            chai.request(app)
                .get(`/statistics/checks/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('checkCount').eql(1)
                    res.body.should.have.property('risk').eql(54.23)
                    res.body.should.have.property('exposeTime').eql(10000)
                    res.body.should.have.property('proximity').eql(2.672)
                    done()
                })
        })

        it('[APIS8] Recuperar estadísticas de las instalaciones registradas en el día de hoy', (done) => {
            let targetDate = Date.parse("2021-09-26 12:00:00")
            let numDays = 0
            chai.request(app)
                .get(`/statistics/installs/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('installCount').eql(2)
                    done()
                })
        })

        it('[APIS9] Recuperar estadísticas de positivos notificados en los últimos 2 días', (done) => {
            let targetDate = Date.parse("2021-10-01 12:00:00")
            let numDays = 2
            chai.request(app)
                .get(`/statistics/positives/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('positiveCount').eql(2)
                    res.body.should.have.property('asymptomaticCount').eql(2)
                    res.body.should.have.property('vaccinatedCount').eql(1)
                    done()
                })
        })

        it('[APIS10] Recuperar estadísticas de resultados de comprobación registrados en los últimos 3 días', (done) => {
            let targetDate = Date.parse("2021-10-01 12:00:00")
            let numDays = 3
            chai.request(app)
                .get(`/statistics/checks/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('checkCount').eql(2)
                    res.body.should.have.property('risk').eql(40.11)
                    res.body.should.have.property('exposeTime').eql(6550)
                    res.body.should.have.property('proximity').eql(2.546)
                    done()
                })
        })

        it('[APIS11] Recuperar estadísticas de las instalaciones registradas en los últimos 2 días', (done) => {
            let targetDate = Date.parse("2021-09-28 12:00:00")
            let numDays = 2
            chai.request(app)
                .get(`/statistics/installs/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('installCount').eql(3)
                    done()
                })
        })

        it('[APIS12] Recuperar estadísticas de positivos notificados en todos los días (numDays: -1)', (done) => {
            let targetDate = Date.parse("2021-10-01 12:00:00")
            let numDays = -1
            chai.request(app)
                .get(`/statistics/positives/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('positiveCount').eql(4)
                    res.body.should.have.property('asymptomaticCount').eql(2)
                    res.body.should.have.property('vaccinatedCount').eql(2)
                    done()
                })
        })

        it('[APIS13] Recuperar estadísticas de resultados de comprobación registrados en todos los días (numDays: -1)', (done) => {
            let targetDate = Date.parse("2021-10-01 12:00:00")
            let numDays = -1
            chai.request(app)
                .get(`/statistics/checks/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('checkCount').eql(3)
                    res.body.should.have.property('risk').eql(44.82)
                    res.body.should.have.property('exposeTime').eql(7700)
                    res.body.should.have.property('proximity').eql(2.588)
                    done()
                })
        })

        it('[APIS14] Recuperar estadísticas de las instalaciones registradas en todos los días (numDays: -1)', (done) => {
            let targetDate = Date.parse("2021-09-28 12:00:00")
            let numDays = -1
            chai.request(app)
                .get(`/statistics/installs/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('installCount').eql(4)
                    done()
                })
        })
    })
})


// MÉTODOS AUXILIARES

/**
 * Devuelve una lista con los positivos de prueba.
 */
function getTestPositives() {
    let p1 = {
        timestamp: "2021-10-01 12:45:06",
        asymptomatic: true,
        vaccinated: false,
        locations: [{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 0,
            point: {
                lat: 43.45,
                lng: -5.98,
                locationTimestamp: Date.parse("2021-09-26 10:30:10")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 1,
            point: {
                lat: 43.44,
                lng: -5.97,
                locationTimestamp: Date.parse("2021-09-26 10:30:15")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 2,
            point: {
                lat: 43.43,
                lng: -5.96,
                locationTimestamp: Date.parse("2021-09-28 11:15:20")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 3,
            point: {
                lat: 42.43,
                lng: -5.95,
                locationTimestamp: Date.parse("2021-09-29 14:30:10")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 4,
            point: {
                lat: 43.44,
                lng: -5.98,
                locationTimestamp: Date.parse("2021-09-30 18:25:45")
            }
        }]
    }

    let p2 = {
        timestamp: "2021-10-02 21:20:20",
        asymptomatic: false,
        vaccinated: false,
        locations: [{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 0,
            point: {
                lat: 44.45,
                lng: -6.98,
                locationTimestamp: Date.parse("2021-09-24 10:30:10")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 1,
            point: {
                lat: 44.44,
                lng: -6.97,
                locationTimestamp: Date.parse("2021-09-24 10:30:15")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 2,
            point: {
                lat: 44.53,
                lng: -6.96,
                locationTimestamp: Date.parse("2021-09-30 11:15:20")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 3,
            point: {
                lat: 44.33,
                lng: -6.95,
                locationTimestamp: Date.parse("2021-10-02 14:30:10")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 4,
            point: {
                lat: 44.44,
                lng: -6.98,
                locationTimestamp: Date.parse("2021-10-02 18:25:45")
            }
        }]
    }

    let p3 = {
        timestamp: "2021-09-26 16:32:10",
        asymptomatic: false,
        vaccinated: true,
        locations: [{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 0,
            point: {
                lat: 44.55,
                lng: -6.98,
                locationTimestamp: Date.parse("2021-09-20 10:30:10")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 1,
            point: {
                lat: 44.44,
                lng: -6.97,
                locationTimestamp: Date.parse("2021-09-20 10:30:15")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 2,
            point: {
                lat: 44.53,
                lng: -6.96,
                locationTimestamp: Date.parse("2021-09-20 11:15:20")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 3,
            point: {
                lat: 44.33,
                lng: -6.95,
                locationTimestamp: Date.parse("2021-09-23 14:30:10")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 4,
            point: {
                lat: 44.44,
                lng: -6.98,
                locationTimestamp: Date.parse("2021-09-23 18:25:45")
            }
        }]
    }

    let p4 = {
        timestamp: "2021-09-29 20:43:08",
        asymptomatic: true,
        vaccinated: true,
        locations: [{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 0,
            point: {
                lat: 44.55,
                lng: -6.98,
                locationTimestamp: Date.parse("2021-09-21 11:50:10")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 1,
            point: {
                lat: 44.44,
                lng: -6.97,
                locationTimestamp: Date.parse("2021-09-21 11:50:15")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 2,
            point: {
                lat: 44.53,
                lng: -6.96,
                locationTimestamp: Date.parse("2021-09-25 14:45:10")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 3,
            point: {
                lat: 44.33,
                lng: -6.95,
                locationTimestamp: Date.parse("2021-09-25 14:45:20")
            }
        },{
            accuracy: 0.0,
            provider: "testing",
            userlocationID: 4,
            point: {
                lat: 44.44,
                lng: -6.98,
                locationTimestamp: Date.parse("2021-09-27 18:25:45")
            }
        }]
    }
    return [p1, p2, p3, p4]
}

/**
 * Devuelve una lista con las instalaciones de prueba.
 */
function getTestInstallations() {
    return [
        Date.parse("2021-09-26 13:35:22"),
        Date.parse("2021-09-26 16:46:45"),
        Date.parse("2021-09-28 19:00:20"),
        Date.parse("2021-09-30 20:05:10")]
}

/**
 * Devuelve una lista con los resultados de comprobaciones de prueba.
 */
function getTestResults() {
    return [{
        exposeTime: 7500,
        proximity: 3.531,
        riskPercent: 34.44,
        timestamp: Date.parse("2021-09-28 15:20:34")
    },{
        exposeTime: 10000,
        proximity: 2.672,
        riskPercent: 54.23,
        timestamp: Date.parse("2021-09-26 14:21:03")
    },{
        exposeTime: 5600,
        proximity: 1.56,
        riskPercent: 45.78,
        timestamp: Date.parse("2021-10-01 11:00:00")
    }]
}