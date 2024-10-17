import bcrypt from "bcryptjs"
import postgres from "postgres"
import sql from "../sql"
import { User, UserId, UserCreate, UserUpdate, UserRegister, UserLogin, UserRecord } from "common"
import { UserAuthenticationError, UserRegistrationError, UsernameExistsError } from "./UserErrors"

const SALT_LENGTH = 10

/**
 * Users API for interacting with the users table in the database.
 */
export class Users {

    /**
     * Registers a new user in the system.  The passed password should be in plain text, it'll then
     * be hashed and salted before being insterted into the database.
     *
     * This low-level function does not do any validation or parsing of the passed data.  It is
     * expected that this happens in the endpoint.
     *
     * @param newUser The details of the user to register: name, username, password.
     * @returns The created User.  Note that this excludes the password and salt fields.
     *
     * @throws {@link UsernameExistsError} if the insert failed the unique constraint on the
     * username field.
     *
     * @throws {@link UserRegistrationError} if there were no PostgresErrors caught but no user
     * records were returned.
     *
     * @throws PostgresError if there was an underlying error with the interaction with the
     * database, for example if it could not connect.
     *
     * @example
     * const user = await Users.register({
     *   name: "Bilbo Baggins",
     *   username: "bilbo@baggins.com",
     *   password: "Prec!ous"
     * })
     */
    static async register(newUser: UserRegister) : Promise<User> {
        const passwordHash = await bcrypt.hash(newUser.password, SALT_LENGTH)

        const userToInsert: UserCreate = {
            name: newUser.name,
            username: newUser.username,
            password: passwordHash,
        }

        try {
            // Note that we're not returning the password, we obviously don't want to be passing
            // that around in the system.
            const result = await sql`
                INSERT INTO users
                ${sql(userToInsert)}
                RETURNING id, name, username`

            if (result.length === 1) {
                return result[0] as User
            } else {
                throw new UserRegistrationError(`Users.register failed.`)
            }
        } catch(e) {
            if (e instanceof postgres.PostgresError && e.constraint_name === "users_username_key") {
                throw new UsernameExistsError(`Username exists: ${newUser.username}`)
            }

            throw e
        }
    }

    /**
     * Authenticates the user against the database.
     *
     * @param login The login details to use: username and password (plain text).
     * @returns The User record if successfully authenticated, otherwise a UserAuthenticationError.
     *
     * @throws {@link UserAuthenticationError} if the user was not successfully authenticated.  No
     * reason is supplied.
     *
     * @throws PostgresError if there was an underlying error with the database.
     *
     * @example
     * const user = await Users.login({
     *   username: "bilbo@baggins.com",
     *   password: "Prec!ous"
     * })
     */
    static async authenticate(login: UserLogin): Promise<User> {
        const result = await sql<UserRecord[]>`
            SELECT *
            FROM users
            WHERE username = ${login.username}`
        
        if (result.length === 1) {
            const userRecord = result[0]
            const authenticated = await bcrypt.compare(login.password, userRecord.password)

            if (authenticated) {
                // We explicitly don't want to pass the password hash around in the system.
                return { id: userRecord.id, username: userRecord.username, name: userRecord.name }
            }
        }

        throw new UserAuthenticationError(`Failed to authenticate user: ${login.username}`)
    }
}