/**
 * Thrown when a database query that specifies a game cannot find the game.
 */
export class GameNotFoundError extends Error {
    constructor(message: string) {
        super(message)
    }
}

/**
 * Thrown when a Game record is created/updated and the id that's being set already exists.
 */
export class GameExistsError extends Error {
    constructor(message: string) {
        super(message)
    }
}

/**
 * Thrown when there is a problem creating a game that does not throw an underlying PostgresError.
 * So in-theory should never be thrown, but we'll see if we can find a way.
 */
export class GameCreateError extends Error {
    constructor(message: string) {
        super(message)
    }
}
