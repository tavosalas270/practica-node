import { readJSON } from "../utils.js";
import { randomUUID } from "node:crypto";
const movies = readJSON('./movies.json')

export class MovieModel {
    static async getAll ({genre}) {
        if (genre) {
            return movies.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
        } else {
            return movies
        }
    }

    static async getById ({id}) {
        const movie = movies.find(m => m.id === id)
        return movie
    }

    static async create ({input}) {
        const newMovie = {
            id: randomUUID(),
            ...input
        }
        movies.push(newMovie)
        return newMovie
    }

    static async delete ({id}) {
        const movieIndex = movies.findIndex(m => m.id === id)
        if (movieIndex === -1) {
            return false
        } else {
            movies.splice(movieIndex, 1)
            return true
        }
    }

    static async update ({id, input}) {
        const movieIndex = movies.findIndex(m => m.id === id)
        if (movieIndex === -1) {
            return false
        } else {
            movies[movieIndex] = {
                ...movies[movieIndex],
                ...input
            }
            return movies[movieIndex]
        }
    }
}