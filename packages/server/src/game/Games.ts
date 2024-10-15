import postgres from "postgres"
import sql from "../sql"
import { Game, GameCreate, GameUpdate, GameId } from "common"

/**
 * Users API for interacting with the games table in the database, as well as additional queries
 * that join other tables related to the games table.
 */
export class Games {
    static async findById(id: GameId): Promise<Game> {
        const result = await sql<Game[]>`
            SELECT * FROM games
            WHERE id = ${id}`
        
        if (result.length === 1) {
            return result[0]
        } else {
            throw new Error(`Game not found: ${id}`)
        }
    }

    static async create(newGame: GameCreate): Promise<Game> {
        const result = await sql<Game[]>`
            INSERT INTO games
            ${sql(newGame)}
            RETURNING *`
        
        return result[0]
    }

    static async update(id: GameId, data: GameUpdate): Promise<Game> {
        const result = await sql<Game[]>`
            UPDATE games SET ${sql(data)}
            WHERE id = ${id}
            RETURNING *`
        
        return result[0]
    }

    static async remove(id: GameId): Promise<Game> {
        const result = await sql<Game[]>`
            DELETE FROM games
            WHERE id = ${id}
            RETURNING *`
        
        return result[0]
    }
}