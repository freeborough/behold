import "dotenv/config"
import sql from "../src/sql"

function doing(message: string) {
    process.stdout.write(`${message}... `)
}

function done() {
    process.stdout.write("DONE!\n")
}

export async function up() {
    
    try {
        doing("CREATE TABLE users")
        await sql`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                salt TEXT NOT NULL
            )
        `
        done()

        doing("CREATE TABLE games")
        await sql`
            CREATE TABLE games (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                owner_id UUID NOT NULL REFERENCES users,
                name TEXT NOT NULL,
                description TEXT,
                slug TEXT NOT NULL UNIQUE
            )
        `
        done()
    } catch(e) {
        console.error(e)
    }
}

export async function down() {
    try {
        doing("DROP TABLE games")
        await sql`DROP TABLE IF EXISTS games`
        done()

        doing("DROP TABLE users")
        await sql `DROP TABLE IF EXISTS users`
        done()
    } catch(e) {
        console.error(e)
    }
}
