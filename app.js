const express = require('express')
const app = express()

const port = process.env.port || 8080
const hostname = "127.0.0.1"

app.get('/', (req, res) => {
    res.send("Hello World!!")
})

app.listen(port, hostname, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})