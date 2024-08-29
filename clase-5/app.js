import express, { json } from 'express';
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

const app = express()

app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

const PORT = process.env.PORT || 1234

// Asi utilizo todas mis rutas de API
app.use('/movies', moviesRouter)

app.listen(PORT, () => {
    console.log("Escuchando en el puerto", PORT)
})