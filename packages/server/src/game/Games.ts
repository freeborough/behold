import postgres from "postgres"
import sql from "../sql"
import { Game, GameCreate, GameUpdate, GameId } from "common"
import { GameCreateError, GameExistsError, GameNotFoundError, GameSlugExistsError } from "./GameErrors"


/**
 * Users API for interacting with the games table in the database, as well as additional queries
 * that join other tables related to the games table.
 */
export class Games {
    static async create(newGame: GameCreate): Promise<Game> {
        try {
            const result = await sql<Game[]>`
                INSERT INTO games
                ${sql(newGame)}
                RETURNING *`
            
            if (result.length === 1) {
                return result[0]
            }
        } catch(e) {
            if (e instanceof postgres.PostgresError) {
                if (e.constraint_name === "games_id_key") {
                    throw new GameExistsError(`Game exists: ${newGame.id}`)
                } else if (e.constraint_name === "games_slug_key") {
                    throw new GameSlugExistsError(`Game slug exists: ${newGame.slug}`)
                }
            }

            throw e
        }

        throw new GameCreateError(`Could not create game.`)
    }

    static async update(id: GameId, data: GameUpdate): Promise<Game> {
        try {
            const result = await sql<Game[]>`
                UPDATE games SET ${sql(data)}
                WHERE id = ${id}
                RETURNING *`
            
            if (result.length === 1) {
                return result[0]
            } else {
                throw new GameNotFoundError(`Game not found: ${id}`)
            }
        } catch(e) {
            if (e instanceof postgres.PostgresError) {
                if (e.constraint_name === "games_id_key") {
                    throw new GameExistsError(`Game exists: ${data.id}`)
                } else if (e.constraint_name === "games_slug_key") {
                    throw new GameSlugExistsError(`Game slug exists: ${data.slug}`)
                }
            }

            throw e
        }
    }

    static async remove(id: GameId): Promise<Game> {
        const result = await sql<Game[]>`
            DELETE FROM games
            WHERE id = ${id}
            RETURNING *`
        
        if (result.length === 1) {
            return result[0]
        } else {
            throw new GameNotFoundError(`Game not found: ${id}`)
        }
    }
}