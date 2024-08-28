const express = require('express')
const crypto = require("node:crypto")
const cors = require('cors');
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://movies.com"
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))

const PORT = process.env.PORT || 1234

app.get('/movies', (req, res) => {
    const { genre } = req.query
    if (genre) {
        const filterMovies = movies.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return res.json(filterMovies)
    } else {
        res.json(movies)
    }
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(m => m.id === id)
    if (movie) {
        return res.json(movie)
    } else {
        res.status(404).json({message: 'Movie not found'})
    }
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    if (result.error) {
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
    if (result.error) {
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const { id } = req.params
    const movieIndex = movies.findIndex(m => m.id === id)
    if (movieIndex === -1) {
        res.status(404).json({message: 'Movie not found'})
    } else {
        const updateMovie = {
            ...movies[movieIndex],
            ...result.data
        }

        movies[movieIndex] = updateMovie
        return res.json(updateMovie)
    }
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(m => m.id === id)
    if (movieIndex === -1) {
        res.status(404).json({message: 'Movie not found'})
    } else {
        movies.splice(movieIndex, 1)
        res.json({message: 'Movie deleted'})
    }
})

app.listen(PORT, () => {
    console.log("Escuchando en el puerto", PORT)
})