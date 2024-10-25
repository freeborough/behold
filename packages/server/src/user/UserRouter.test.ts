import "dotenv/config"
import { describe, it, beforeEach, expect, vi } from "vitest"
import request from "supertest"
import { StatusCodes as HttpStatus } from "http-status-codes"

import { app } from "../app"
import * as migrate from "../../migrations/base"
import { sql } from "../sql"

async function post(url: string, data: any): Promise<request.Response> {
    return await request(app)
        .post(url)
        .send(data)
}

beforeEach(async () => {
    await migrate.down()
    await migrate.up()
})

const uuidRegex = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)

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

            expect(r.statusCode).toBe(HttpStatus.OK)
            expect(r.body.name).toBe(valid.name)
            expect(r.body.username).toBe(valid.username)
            expect(r.body.password).toBeUndefined()
            expect(r.body.id).toMatch(uuidRegex)
        })

        it("sets session and clientSession cookies when valid details are posted.", async () => {
            const agent = request.agent(app)
            const r = await agent.post(url).send(valid)

            console.log(r.headers["set-cookie"])

            // As Request.headers["set-cookie"] type is defined as string, but is actually string[]
            // when multiple cookies are set in one response, we need to cooerce things a little.
            // We don't want the expect's within an if block that might be missed, so instead we
            // pull them out with the regular expression to check they're valid, then chech that
            // those variables are defined in our expect - thus achieving the same result.
            let sessionCookie
            let clientSessionCookie

            if (Array.isArray(r.headers["set-cookie"])) {
                sessionCookie = r.headers["set-cookie"].find(c => c.match(/^session=.*; Path=\/; HttpOnly$/))
                clientSessionCookie = r.headers["set-cookie"].find(c => c.match(/^clientSession=.*; Path=\/$/))
            }

            expect(r.headers["set-cookie"]).toBeDefined()
            expect(sessionCookie).toBeDefined()
            expect(clientSessionCookie).toBeDefined()
        })

        it("returns a validation issue if the username (email) was malformed.", async () => {
            const r = await post(url, invalidUsername)

            expect(r.statusCode).toBe(HttpStatus.BAD_REQUEST)
            expect(r.body[0].kind).toBe("VALIDATION")
            expect(r.body[0].references).toBe("username")
        })

        it("returns a validation issue if a name was not given.", async () => {
            const r = await post(url, missingName)

            expect(r.statusCode).toBe(HttpStatus.BAD_REQUEST)
            expect(r.body[0].kind).toBe("VALIDATION")
            expect(r.body[0].references).toBe("name")
        })

        it("returns a validation issue if the username was not given.", async () => {
            const r = await post(url, missingUsername)

            expect(r.statusCode).toBe(HttpStatus.BAD_REQUEST)
            expect(r.body[0].kind).toBe("VALIDATION")
            expect(r.body[0].references).toBe("username")
        })

        it("returns a validation issue if the user's password was not given.", async () => {
            const r = await post(url, missingPassword)

            expect(r.statusCode).toBe(HttpStatus.BAD_REQUEST)
            expect(r.body[0].kind).toBe("VALIDATION")
            expect(r.body[0].references).toBe("password")
        })

        it("returns a constraint issue if the username already exists.", async () => {
            const existing = await post(url, valid)
            const r = await post(url, valid)

            expect(r.statusCode).toBe(HttpStatus.BAD_REQUEST)
            expect(r.body[0].kind).toBe("CONSTRAINT")
            expect(r.body[0].references).toBe("username")
        })

        it("includes salt in the password hash so two identical passwords will have different hashes.", async () => {
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

            expect(r.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
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

            expect(r.statusCode).toBe(HttpStatus.OK)
            expect(r.body.name).toBe(valid.name)
            expect(r.body.username).toBe(valid.username)
            expect(r.body.id).toBe(existing.body.id)
        })

        it("returns a constraint issue if the wrong password is supplied.", async() => {
            await post("/api/user/register", valid)
            const r = await post(url, { username: wrongPassword.username, password: wrongPassword.password })

            expect(r.statusCode).toBe(HttpStatus.BAD_REQUEST)
            expect(r.body[0].kind).toBe("CONSTRAINT")
            expect(r.body[0].references).toBe(wrongPassword.username)
        })

        it("returns an internal issue if there was an underlying database error.", async () => {
            // Mock console.error to supress the errors that will of course be output.
            vi.spyOn(console, "error").mockImplementation(() => undefined)
            await migrate.down();
            const r = await post(url, valid)
            vi.restoreAllMocks()

            expect(r.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
            expect(r.body[0].kind).toBe("INTERNAL")
        })
    })

    describe("logout", async () => {
        const url = "/api/user/logout"

        const valid = { name: "Bilbo Baggins", username: "bilbo@baggins.com", password: "Prec1ous!" }

        it("does not authorize logging out if you don't have an active session.", async () => {
            const r = await post(url, {})

            expect(r.statusCode).toBe(HttpStatus.FORBIDDEN)
        })

        it("can be called when you have an active session then subsequently you are no longer authorized to logout.", async () => {
            const agent = request.agent(app)
            await agent.post("/api/user/register").send(valid)

            const r = await agent.post(url).send()
            expect(r.statusCode).toBe(HttpStatus.NO_CONTENT)

            const authResponse = await agent.post(url).send()
            expect(authResponse.statusCode).toBe(HttpStatus.FORBIDDEN)
        })
    })
})
