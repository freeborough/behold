/**
 * Thrown when a database query that specifies a game cannot find the game.
 */
export class GameNotFoundError extends Error {
    constructor(message: string) {
        super(message)
    }
}
