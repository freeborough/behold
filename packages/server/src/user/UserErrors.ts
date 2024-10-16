// TODO: These are just placeholders for now, when we have more of the system implemented we can
// define all the information we need our errors to store and how they're going to be communicated
// to the user and/or the hosts.

/**
 * Thrown when there is a problem with user registration that does not throw an underlying
 * PostgresError.  This shouldn't be caught so may not be needed, but we'll see if we can write a
 * test to force it to occur.
 */
export class UserRegistrationError extends Error {
    constructor(message: string) {
        super(message)
    }
}

/**
 * Thrown when trying to register and the passed username does not pass the unique constraint on
 * that field in the database.
 */
export class UsernameExistsError extends Error {
    constructor(message: string) {
        super(message)
    }
}

/**
 * Thrown when a user fails to authenticate.  Must not indicate the cause of the failure so it
 * reduce it being used to identify valid users.
 */
export class UserAuthenticationError extends Error {
    constructor(message: string) {
        super(message)
    }
}