import postgres from "postgres"
import sql from "../sql"
import { Game, GameCreate, GameUpdate, GameId, GameStore, Result, GameCreateSchema, GameIdSchema, GameUpdateSchema, Issue, IssueKind } from "common"
import { errorToIssue } from "../util/results"


/**
 * Users API for interacting with the games table in the database, as well as additional queries
 * that join other tables related to the games table.
 */
export class Games implements GameStore {
    /**
     * Creates a new game record in the database.
     *
     * @param newGame The details of the new game to create.
     * @returns The newly created game.
     * 
     * @example
     * const game = await Games.create({
     *   name: "The Blind Leading the Blind",
     *   slug: "the-blind-leading-the-blind",
     *   description: "In a world where magic has been forgotten... four wizards set out to save the world.",
     *   owner_id: "b13daf91-0c4c-4f94-a63b-920d3245001a",
     * })
     */
    async create(newGame: GameCreate): Promise<Result<Game>> {
        try {
            const parsed = GameCreateSchema.parse(newGame)
            const result = await sql<Game[]>`
                INSERT INTO games
                ${sql(parsed)}
                RETURNING *`
            
            return { ok: true, value: result[0] }
        } catch(e) {
            return { ok: false, issues: errorToIssue(e as Error) }
        }
    }

    /**
     * Updates an existing game record in the database.
     *
     * @param id    The unique identifier of the game to update.
     * @param data  The details of the fields to update and their new values.
     * @returns     The full updated game record.
     * 
     * @example
     * const game = await Games.update("38a47d67-459b-4ceb-9895-518db1f8bdf8", {
     *   description: "In a world where magic has been forgotten... four wizards make things worse.",
     * })
     */
    async update(id: GameId, data: GameUpdate): Promise<Result<Game>> {
        try {
            const parsedId = GameIdSchema.parse(id)
            const parsedData = GameUpdateSchema.parse(data)
            const result = await sql<Game[]>`
                UPDATE games SET ${sql(parsedData)}
                WHERE id = ${parsedId}
                RETURNING *`
            
            if (result.length === 1) {
                return { ok: true, value: result[0] }
            } else {
                return { ok: false, issues: [new Issue("Game not found.", IssueKind.CONSTRAINT, "id")]}
            }
        } catch(e) {
            return { ok: false, issues: errorToIssue(e as Error) }
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
    async remove(id: GameId): Promise<Result<Game>> {
        try {
            const parsedId = GameIdSchema.parse(id)
            const result = await sql<Game[]>`
            DELETE FROM games
            WHERE id = ${id}
            RETURNING *`
        
            if (result.length === 1) {
                return { ok: true, value: result[0] }
            } else {
                return { ok: false, issues: [new Issue("Game not found.", IssueKind.CONSTRAINT, "id")] }
            }
        } catch(e) {
            return { ok: false, issues: errorToIssue(e as Error) }
        }
    }
}