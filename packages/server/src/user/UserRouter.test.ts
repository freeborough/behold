import "dotenv/config"
import { describe, it, beforeEach, expect, vi } from "vitest"
import supertest from "supertest"

import { app } from "../app"
import * as migrate from "../../migrations/base"
import { sql } from "../sql"

async function post(url: string, data: any): Promise<supertest.Response> {
    return await supertest(app)
        .post(url)
        .send(data)
}

beforeEach(async () => {
    await migrate.down()
    await migrate.up()
})

// NOTE: I am not checking the issue messages themselves, the bit that would be displayed to the
//       user, as this will be run through a translation lookup.
describe("UserRouter", () => {
    describe("register", async () => {
        const url = "/api/user/register"

        const valid = { name: "Bilbo Baggins", username: "bilbo@baggins.com", password: "Prec1ous!" }
        const validSamePassword = { name: "Frodo Baggins", username: "frodo@baggins.com", password: valid.password }
        const invalidUsername = { username: "bilbo", name: valid.name, password: valid.password }
        const missingName = { username: valid.username, password: valid.password }
        const missingUsername = { name: valid.name, password: valid.password }
        const missingPassword = { name: valid.name, username: valid.username }

        it("returns the user's name, username, and id when valid details are posted.", async () => {
            const r = await post(url, valid)

            expect(r.statusCode).toBe(200)
            expect(r.body.name).toBe(valid.name)
            expect(r.body.username).toBe(valid.username)
            expect(r.body.password).toBeUndefined()
            expect(r.body.id).toMatch(new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/))
        })

        it("returns a validation issue if the username (email) was malformed.", async () => {
            const r = await post(url, invalidUsername)

            expect(r.statusCode).toBe(400)
            expect(r.body[0].kind).toBe("VALIDATION")
            expect(r.body[0].references).toBe("username")
        })

        it("returns a validation issue if a name was not given.", async () => {
            const r = await post(url, missingName)

            expect(r.statusCode).toBe(400)
            expect(r.body[0].kind).toBe("VALIDATION")
            expect(r.body[0].references).toBe("name")
        })

        it("returns a validation issue if the username was not given.", async () => {
            const r = await post(url, missingUsername)

            expect(r.statusCode).toBe(400)
            expect(r.body[0].kind).toBe("VALIDATION")
            expect(r.body[0].references).toBe("username")
        })

        it("returns a validation issue if the user's password was not given.", async () => {
            const r = await post(url, missingPassword)

            expect(r.statusCode).toBe(400)
            expect(r.body[0].kind).toBe("VALIDATION")
            expect(r.body[0].references).toBe("password")
        })

        it("returns a constraint issue if the username already exists.", async () => {
            const existing = await post(url, valid)
            const r = await post(url, valid)

            expect(r.statusCode).toBe(400)
            expect(r.body[0].kind).toBe("CONSTRAINT")
            expect(r.body[0].references).toBe("username")
        })

        it("includes salt in the password hash so two identical passwords will have different hashes", async () => {
            await post(url, valid)
            await post(url, validSamePassword)

            // We need to hit the underlying database for this as our API doesn't and won't provide
            // a means of doing this.
            const records = await sql`
                SELECT password
                FROM users
                WHERE username = ${valid.username} OR username = ${validSamePassword.username}`

            expect(records[0].password).not.toBe(records[1].password)
        })

        it("returns an internal issue if there was an underlying database issue.", async () => {
            // Mock console.error to supress the errors that will of course be output.
            vi.spyOn(console, "error").mockImplementation(() => undefined)
            await migrate.down();
            const r = await post(url, valid)
            vi.restoreAllMocks()

            expect(r.statusCode).toBe(500)
            expect(r.body[0].kind).toBe("INTERNAL")
        })
    })

    describe("authenticate", async () => {
        const url = "/api/user/authenticate"

        const valid = { name: "Bilbo Baggins", username: "bilbo@baggins.com", password: "Prec1ous!" }
        const wrongPassword = { name: valid.name, username: valid.username, password: "thereandback" }

        it("returns the user's id, name, and username when valid credentials are given.", async() => {
            const existing = await post("/api/user/register", valid)
            const r = await post(url, { username: valid.username, password: valid.password })

            expect(r.statusCode).toBe(200)
            expect(r.body.name).toBe(valid.name)
            expect(r.body.username).toBe(valid.username)
            expect(r.body.id).toBe(existing.body.id)
        })

        it("returns a constraint issue if the wrong password is supplied.", async() => {
            await post("/api/user/register", valid)
            const r = await post(url, { username: wrongPassword.username, password: wrongPassword.password })

            expect(r.statusCode).toBe(400)
            expect(r.body[0].kind).toBe("CONSTRAINT")
            expect(r.body[0].references).toBe(wrongPassword.username)
        })

        it("returns an internal issue if there was an underlying database error.", async () => {
            // Mock console.error to supress the errors that will of course be output.
            vi.spyOn(console, "error").mockImplementation(() => undefined)
            await migrate.down();
            const r = await post(url, valid)
            vi.restoreAllMocks()

            expect(r.statusCode).toBe(500)
            expect(r.body[0].kind).toBe("INTERNAL")
        })
    })
})
