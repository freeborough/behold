import bcrypt from "bcryptjs"
import postgres from "postgres"
import { z } from "zod"
import sql from "../sql"
import {
    UserStore, User, UserId, UserCreate, UserUpdate, UserRegister, UserRegisterSchema, UserLogin, 
    UserRecord, Issue, IssueKind, Result, ok, issue, UserLoginSchema
} from "common"
import { errorToIssue } from "../util/results"

const SALT_LENGTH = 10

/**
 * Users API for interacting with the users table in the database.
 */
export class UserStorePostgres implements UserStore {

    /**
     * Registers a new user in the system.  The passed password should be in plain text, it'll then
     * be hashed and salted before being insterted into the database.
     *
     * This low-level function does not do any validation or parsing of the passed data.  It is
     * expected that this happens in the endpoint.
     *
     * @param newUser The details of the user to register: name, username, password.
     * @returns The created {@link User} (which exclused the password field) or an array of Issues.
     *
     * @example
     * const user = await Users.register({
     *   name: "Bilbo Baggins",
     *   username: "bilbo@baggins.com",
     *   password: "Prec!ous"
     * })
     */
    async register(newUser: UserRegister) : Promise<Result<User>> {
        try {
            const parsed = UserRegisterSchema.parse(newUser)
            const passwordHash = await bcrypt.hash(parsed.password, SALT_LENGTH)
            const userToInsert: UserCreate = {
                name: parsed.name,
                username: parsed.username,
                password: passwordHash,
            }    

            // Note that we're not returning the password, we obviously don't want to be passing
            // that around in the system.
            const result = await sql`
                INSERT INTO users
                ${sql(userToInsert)}
                RETURNING id, name, username`

            return ok(result[0] as User)
        } catch(e) {
            return issue(errorToIssue(e as Error))
        }
    }

    /**
     * Authenticates the user against the database.
     *
     * @param login The login details to use: username and password (plain text).
     * @returns The User record if successfully authenticated, otherwise a UserAuthenticationError.
     *
     * @example
     * const user = await Users.login({
     *   username: "bilbo@baggins.com",
     *   password: "Prec!ous"
     * })
     */
    async authenticate(login: UserLogin): Promise<Result<User>> {
        try {
            const parsed = UserLoginSchema.parse(login)
            const result = await sql<UserRecord[]>`
                SELECT *
                FROM users
                WHERE username = ${parsed.username}`
        
            if (result.length === 1) {
                const userRecord = result[0]
                const authenticated = await bcrypt.compare(parsed.password, userRecord.password)

                if (authenticated) {
                    // We explicitly don't want to pass the password hash around in the system.
                    return ok({
                        id: userRecord.id,
                        username: userRecord.username,
                        name: userRecord.name })
                }
            }

            return issue(new Issue("Failed to authenticate.", IssueKind.CONSTRAINT, parsed.username))
        } catch(e) {
            return issue(errorToIssue(e as Error))
        }
    }
}
