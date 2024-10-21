import "dotenv/config"
import { describe, it, beforeEach, expect, vi } from "vitest"
import request from "supertest"
import { StatusCodes as HttpStatus } from "http-status-codes"

import { app } from "../app"
import * as migrate from "../../migrations/base"
import { sql } from "../sql"

beforeEach(async () => {
    await migrate.down()
    await migrate.up()
})

const uuidRegex = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)

// NOTE: I am not checking the issue messages themselves, the bit that would be displayed to the
//       user, as this will be run through a translation lookup.
describe("GameRouter", () => {

    const validUser = { name: "Bilbo Baggins", username: "bilbo@baggins.com", password: "Prec1ous!" }

    const validGame = { 
        name: "The Blind Leading the Blind",
        slug: "the-blind-leading-the-blind",
        description: "In a world where magic has been forgotten... four wizards set out to save the world."
    }

    const anotherValidGame = {
        name: "Mech Assault Mayhem",
        slug: "mech-assault-mayhem",
        description: "Four pilots must solve mysterys by punching their way to the truth in giant death robots."
    }

    describe("create", () => {
        const url = "/api/game/create"

        it("is only available to authorised users.", async () => {
            const r = await request(app).post(url).send(validGame)

            expect(r.statusCode).toBe(HttpStatus.FORBIDDEN)
            expect(r.body).toMatchObject({})
        })

        it("returns a game with a generated id and the owner set to the logged in user.", async () => {
            const agent = request.agent(app)
            const userResponse = await agent.post("/api/user/register").send(validUser)
            const r = await agent.post(url).send(validGame)

            expect(r.statusCode).toBe(HttpStatus.OK)
            expect(r.body.name).toBe(validGame.name)
            expect(r.body.slug).toBe(validGame.slug)
            expect(r.body.description).toBe(validGame.description)
            expect(r.body.owner_id).toBe(userResponse.body.id)
            expect(r.body.id).toMatch(uuidRegex)
        })
    })

    describe("all", () => {
        const url = "/api/game/all"

        it("is only available to authorised users.", async () => {
            const r = await request(app).get(url).send(validGame)

            expect(r.statusCode).toBe(HttpStatus.FORBIDDEN)
            expect(r.body).toMatchObject({})
        })

        // TODO: and all the games they're a player of.
        it("returns all the games owned by the user.", async () => {
            const agent = request.agent(app)
            const userResponse = await agent.post("/api/user/register").send(validUser)
            const gameResponseA = await agent.post("/api/game/create").send(validGame)
            const gameResponseB = await agent.post("/api/game/create").send(anotherValidGame)
            const r = await agent.get(url).send()

            // TODO: Look to see if there are better ways to do this out of the box, but if not
            // maybe create some helper functions to work with testing creating/fetching multiple
            // objects.
            expect(r.statusCode).toBe(HttpStatus.OK)
            expect(r.body.length).toBe(2)
            expect(r.body[0].owner_id).toBe(userResponse.body.id)
            expect(r.body[1].owner_id).toBe(userResponse.body.id)
            expect(r.body[0].id).oneOf([gameResponseA.body.id, gameResponseB.body.id])
            expect(r.body[1].id).oneOf([gameResponseA.body.id, gameResponseB.body.id])
        })
    })
})