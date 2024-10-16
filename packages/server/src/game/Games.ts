import postgres from "postgres"
import sql from "../sql"
import { Game, GameCreate, GameUpdate, GameId } from "common"
import { GameCreateError, GameExistsError, GameNotFoundError, GameSlugExistsError } from "./GameErrors"


/**
 * Users API for interacting with the games table in the database, as well as additional queries
 * that join other tables related to the games table.
 */
export class Games {
    /**
     * Creates a new game record in the database.
     *
     * @param newGame The details of the new game to create.
     * @returns The newly created game.
     *
     * @throws {@link GameExistsError} if the insert failed the unique constraint on the id field.
     * 
     * @throws {@link GameSlugExistsError} if the insert failed the unique constraint on the slug
     * field.
     * 
     * @throws PostgresError if there was an underlying error with the interaction with the
     * database, for example if it could not connect.
     * 
     * @example
     * const game = await Games.create({
     *   name: "The Blind Leading the Blind",
     *   slug: "the-blind-leading-the-blind",
     *   description: "In a world where magic has been forgotten... four wizards set out to save the world.",
     *   owner_id: "b13daf91-0c4c-4f94-a63b-920d3245001a",
     * })
     */
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

    /**
     * Updates an existing game record in the database.
     *
     * @param id    The unique identifier of the game to update.
     * @param data  The details of the fields to update and their new values.
     * @returns     The full updated game record.
     *
     * @throws {@link GameExistsError} if the update failed the unique constraint on the id field.
     * 
     * @throws {@link GameSlugExistsError} if the update failed the unique constraint on the slug
     * field.
     * 
     * @throws PostgresError if there was an underlying error with the interaction with the
     * database, for example if it could not connect.
     * 
     * @example
     * const game = await Games.update("38a47d67-459b-4ceb-9895-518db1f8bdf8", {
     *   description: "In a world where magic has been forgotten... four wizards make things worse.",
     * })
     */
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

    /**
     * Removes a game from the system, which will in-turn remove the following linked entities:
     * GamePlayers, Scenes, Layers, and Pieces.
     *
     * @param id    The unique identifier of the game to remove.
     * @returns     The game record that was removed.
     *
     * @throws PostgresError if there was an underlying error with the interaction with the
     * database, for example if it could not connect.
     *
     * @example
     * const oldGame = await Games.delete("38a47d67-459b-4ceb-9895-518db1f8bdf8")
     * 
     */
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