import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
    static async getAll ({genre}) {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase();
            const [genres] = await connection.query("SELECT id, name FROM genre WHERE LOWER(name) = ?;", [lowerCaseGenre])

            if (genres.length === 0) {
                return null
            } else {
                const [movies] = await connection.query(`select BIN_TO_UUID(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.rate, g.name 
                from movie m INNER JOIN movie_genres mg ON m.id = mg.movie_id
                INNER JOIN genre g ON mg.genre_id = g.id
                WHERE LOWER(g.name) = ?;`, [lowerCaseGenre])
                return movies
            }
        } else {
            const [movies] = await connection.query("select BIN_TO_UUID(id) id, title, year, director, duration, poster, rate from movie;")
            return movies
        }
    }

    static async getById ({id}) {
        const [movies] = await connection.query(
            "select BIN_TO_UUID(id) id, title, year, director, duration, poster, rate from movie WHERE id = UUID_TO_BIN(?);", [id]
        )

        if (movies.length === 0) {
            return null
        } else {
            return movies[0]
        }
    }

    static async create ({input}) {
        const {
            genre: genreInput,
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input
    }

    static async delete ({id}) {

    }

    static async update ({id, input}) {

    }
}