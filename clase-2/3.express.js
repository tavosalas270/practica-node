const express = require('express')
const dittoJson = require("./pokemon/ditto.json")

const app = express()

// Siempre se recomienda quitar esto de la respuesta en las API
app.disable('x-powered-by') 

const PORT = process.env.PORT || 1234

app.use(express.json())

// app.use((req, res, next) => {
//     if (req.method !== 'POST') return next()
//     if (req.headers['content-type'] !== 'application/json') return next()

//     let body = ''
//     req.on('data', chunk => {
//         body += chunk.toString()
//     })
//     req.on('end' , () => {
//         const data = JSON.parse(body)
//         data.timestamp = Date.now()
//         req.body = data
//         next()
//     })
//     // Ahora solo llegan request que son POST y tienen header application/json
// })

app.get('/', (req, res) => {
    // Por defecto el status es 200
    // res.send('<h1>Mi pagina</h1>')
    res.json({message: 'Hola mundo desde express'})
})

app.get('/pokemon/ditto', (req, res) => {
    res.json(dittoJson)
})

app.post('/pokemon', (req, res) => {
    res.status(201).json(req.body)
})

app.use((req, res) => {
    res.status(201).send('<h1>404</h1>')
})

app.listen(PORT, () => {
    console.log("Escuchando en el puerto", PORT)
})