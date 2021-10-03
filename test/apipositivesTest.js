// Dependencias de Test
let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../app.js')
let should = chai.should() // Tipo de aserción: should
let di = require('../di/AppModule.js') // Inyección de dependencias

chai.use(chaiHttp) // Usar plugin de chai http

describe('Positives API', () => {
    // Before Each (antes de cada Test)
    beforeEach((done) => {
        // Positivos de prueba
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
            vaccinated: false,
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
        // Eliminar positivos
        di.positiveRepository().deleteAllPositives(() => {
            // Rellenar base de datos con positivos
            di.positiveRepository().addPositive(p1, (docRef) => {
                di.positiveRepository().addPositive(p2, (docRef) => {
                    di.positiveRepository().addPositive(p3, (docRef) => {
                        done()
                    }, (error) => {console.log("Error al insertar el positivo.")})
                }, (error) => {console.log("Error al insertar el positivo.")})
            }, (error) => console.log("Error al insertar el positivo."))
        })
    })

    // Obtener todos los positivos
    describe('/GET all positives', () => {
        it('[APIP1] Debería devolver todos los positivos notificados', (done) => {
            chai.request(app)
                .get('/positive/getAllPositives')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(3)
                    let p2 = res.body[0]
                    let p1 = res.body[1]
                    let p3 = res.body[2]
                    p1.should.have.property('locationDates').eql(["2021-09-26", "2021-09-28", "2021-09-29", "2021-09-30"])
                    p2.should.have.property('locationDates').eql(["2021-09-24", "2021-09-30", "2021-10-02"])
                    p3.should.have.property('locationDates').eql(["2021-09-20", "2021-09-23"])
                    done()
                })
        })

        it('[APIP2] Debería devolver una lista vacía de positivos', (done) => {
            // Eliminar positivos
            di.positiveRepository().deleteAllPositives(() => {
                chai.request(app)
                    .get('/positive/getAllPositives')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('array')
                        res.body.length.should.be.eql(0)
                        done()
                    })
            })
        })
    })

    // Notificar un positivo
    describe('/POST positive', () => {
        it('[APIP3] Debería devolver 400 Bad request al intentar notificar un positivo con un objeto vacío', (done) => {
            chai.request(app)
                .post('/positive/notifyPositive')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400)
                    // Comprobar los positivos
                    chai.request(app)
                    .get('/positive/getAllPositives')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('array')
                        res.body.length.should.be.eql(3)
                        let p2 = res.body[0]
                        let p1 = res.body[1]
                        let p3 = res.body[2]
                        p1.should.have.property('locationDates').eql(["2021-09-26", "2021-09-28", "2021-09-29", "2021-09-30"])
                        p2.should.have.property('locationDates').eql(["2021-09-24", "2021-09-30", "2021-10-02"])
                        p3.should.have.property('locationDates').eql(["2021-09-20", "2021-09-23"])
                        done()
                    })
                })
        })

        it('[APIP4] Debería devolver 200 OK al notificar un positivo con localizaciones de un solo día', (done) => {
            // Positivo a insertar
            let p = {
                timestamp: "2021-10-03 18:11:34",
                asymptomatic: true,
                vaccinated: true,
                locations: [{
                    accuracy: 0.0,
                    provider: "testing",
                    userlocationID: 0,
                    point: {
                        lat: 44.55,
                        lng: -6.98,
                        locationTimestamp: Date.parse("2021-09-29 10:30:10")
                    }
                },{
                    accuracy: 0.0,
                    provider: "testing",
                    userlocationID: 1,
                    point: {
                        lat: 44.44,
                        lng: -6.97,
                        locationTimestamp: Date.parse("2021-09-29 10:30:15")
                    }
                },{
                    accuracy: 0.0,
                    provider: "testing",
                    userlocationID: 2,
                    point: {
                        lat: 44.53,
                        lng: -6.96,
                        locationTimestamp: Date.parse("2021-09-29 11:15:20")
                    }
                },{
                    accuracy: 0.0,
                    provider: "testing",
                    userlocationID: 3,
                    point: {
                        lat: 44.33,
                        lng: -6.95,
                        locationTimestamp: Date.parse("2021-09-29 14:30:10")
                    }
                },{
                    accuracy: 0.0,
                    provider: "testing",
                    userlocationID: 4,
                    point: {
                        lat: 44.44,
                        lng: -6.98,
                        locationTimestamp: Date.parse("2021-09-29 18:25:45")
                    }
                }]
            }
            chai.request(app)
                .post('/positive/notifyPositive')
                .send(p)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('positiveCode')
                    res.body.should.have.property('uploadedLocations').eql(5)
                    // Comprobar los positivos
                    chai.request(app)
                    .get('/positive/getAllPositives')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('array')
                        res.body.length.should.be.eql(4)
                        let p4 = res.body[0]
                        p4.should.have.property('locationDates').eql(["2021-09-29"])
                        done()
                    })
                })
        })

        it('[APIP5] Debería devolver 200 OK al notificar un positivo con localizaciones registradas en varios días', (done) => {
            // Positivo a insertar
            let p = {
                timestamp: "2021-10-03 18:11:34",
                asymptomatic: true,
                vaccinated: true,
                locations: [{
                    accuracy: 0.0,
                    provider: "testing",
                    userlocationID: 0,
                    point: {
                        lat: 44.55,
                        lng: -6.98,
                        locationTimestamp: Date.parse("2021-09-29 10:30:10")
                    }
                },{
                    accuracy: 0.0,
                    provider: "testing",
                    userlocationID: 1,
                    point: {
                        lat: 44.44,
                        lng: -6.97,
                        locationTimestamp: Date.parse("2021-09-29 10:30:15")
                    }
                },{
                    accuracy: 0.0,
                    provider: "testing",
                    userlocationID: 2,
                    point: {
                        lat: 44.53,
                        lng: -6.96,
                        locationTimestamp: Date.parse("2021-09-29 11:15:20")
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
            chai.request(app)
                .post('/positive/notifyPositive')
                .send(p)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('positiveCode')
                    res.body.should.have.property('uploadedLocations').eql(5)
                    // Comprobar los positivos
                    chai.request(app)
                    .get('/positive/getAllPositives')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('array')
                        res.body.length.should.be.eql(4)
                        let p4 = res.body[0]
                        p4.should.have.property('locationDates').eql(["2021-09-29", "2021-10-02"])
                        done()
                    })
                })
        })
    })

    
    // Obtener positivos con localizaciones registradas en los últimos días
    describe('/GET positives last days', () => {
        it('[APIP6] Debería devolver una lista vacía porque no hay positivos con localizaciones en esos últimos días', (done) => {
            let targetDate = Date.parse("2021-10-05 15:24:06")
            let numDays = 2
            chai.request(app)
                .get(`/positive/getPositives/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                    done()
                })
        })

        it('[APIP7] Debería devolver una lista con el positivo 2', (done) => {
            let targetDate = Date.parse("2021-10-05 15:24:06")
            let numDays = 3
            chai.request(app)
                .get(`/positive/getPositives/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    let positive = res.body[0]
                    let timestamp = new Date(Date.parse(positive.timestamp)).toLocaleString()
                    timestamp.should.be.eql("2/10/2021 21:20:20")
                    done()
                })
        })

        it('[APIP8] Debería devolver una lista con el positivo 1 y el positivo 2 con una fecha de referencia de mes distinto', (done) => {
            let targetDate = Date.parse("2021-10-02 15:24:06")
            let numDays = 3
            chai.request(app)
                .get(`/positive/getPositives/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(2)
                    let positive2 = res.body[0]
                    let positive1 = res.body[1]
                    let timestamp1 = new Date(Date.parse(positive1.timestamp)).toLocaleString()
                    let timestamp2 = new Date(Date.parse(positive2.timestamp)).toLocaleString()
                    timestamp1.should.be.eql("1/10/2021 12:45:06")
                    timestamp2.should.be.eql("2/10/2021 21:20:20")
                    done()
                })
        })

        it('[APIP9] Debería devolver una lista con el positivo 1, el positivo 2 y el positivo 3', (done) => {
            let targetDate = Date.parse("2021-9-28 15:24:06")
            let numDays = 5
            chai.request(app)
                .get(`/positive/getPositives/${targetDate}/${numDays}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(3)
                    let positive2 = res.body[0]
                    let positive1 = res.body[1]
                    let positive3 = res.body[2]
                    let timestamp1 = new Date(Date.parse(positive1.timestamp)).toLocaleString()
                    let timestamp2 = new Date(Date.parse(positive2.timestamp)).toLocaleString()
                    let timestamp3 = new Date(Date.parse(positive3.timestamp)).toLocaleString()
                    timestamp1.should.be.eql("1/10/2021 12:45:06")
                    timestamp2.should.be.eql("2/10/2021 21:20:20")
                    timestamp3.should.be.eql("26/9/2021 16:32:10")
                    done()
                })
        })
    })



})