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
                const [movies] = await connection.query(
                    `SELECT BIN_TO_UUID(m.id) AS id, m.title, m.year, m.director, m.duration, m.poster, m.rate,
                    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
                    FROM movie m INNER JOIN movie_genres mg ON m.id = mg.movie_id 
                    INNER JOIN genre g ON mg.genre_id = g.id
                    WHERE mg.movie_id IN (
                        SELECT mg.movie_id
                        FROM movie_genres mg
                        INNER JOIN genre g ON mg.genre_id = g.id
                        WHERE LOWER(g.name) IN (?)
                    )
                    GROUP BY m.id, m.title, m.year, m.director, m.duration, m.poster, m.rate
                    ORDER BY m.title;`, 
                [lowerCaseGenre])
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
        const { genre, title, year, duration, director, rate, poster } = input

        const lowerCaseGenre = genre.map((g) => g.toLowerCase());
        const [genres] = await connection.query("SELECT id, name FROM genre WHERE LOWER(name) IN (?);", [lowerCaseGenre])

        if (genres.length === 0) {
            return null
        } else {
            const [uuidResult] = await connection.query("SELECT UUID() uuid;")
            const [{uuid}] = uuidResult
            try {
                await connection.query(
                    `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
                    VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?)`, 
                    [title, year, director, duration, poster, rate]
                )
            } catch (error) {
                console.log(error);
            }

            try {
                await connection.query(
                    `INSERT INTO movie_genres (movie_id, genre_id)
                    SELECT (SELECT id FROM movie WHERE title = ?), g.id
                    FROM genre g WHERE g.name IN (?);`, 
                    [title, lowerCaseGenre]
                )
            } catch (error) {
                console.log(error);
            }
    
            const [movies] = await connection.query(
                `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate 
                FROM movie WHERE id = UUID_TO_BIN(?);`, [uuid]
            )
    
            return movies[0]
        }
    }

    static async delete ({id}) {
        try {
            await connection.query(`DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);`, [id])
            await connection.query(`DELETE FROM movie WHERE id  = UUID_TO_BIN(?);`, [id])
            return true;
        } catch (error) {
            await connection.rollback();
            console.log(error);
            return false;
        }
    }

    static async update ({id, input}) {
        try {
            await connection.query(
                `UPDATE movie
                SET ${Object.entries(input).map(([key, value]) => `${key} = '${value}'`).join(', ')}
                WHERE id = UUID_TO_BIN(?)`, 
                [id]
            )
            const [movies] = await connection.query(
                "select BIN_TO_UUID(id) id, title, year, director, duration, poster, rate from movie WHERE id = UUID_TO_BIN(?);", [id]
            )
            return movies[0]
        } catch (error) {
            console.log(error);
        }
    }
}