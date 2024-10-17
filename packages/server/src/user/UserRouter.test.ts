import "dotenv/config"

import { describe, it, beforeEach, expect } from "vitest"
import supertest from "supertest"
import { app } from "../app"
import { UserRegister } from "common"
import * as migrate from "../../migrations/base"

beforeEach(async () => {
    await migrate.down()
    await migrate.up()
})

describe("UserRouter", () => {
    describe("register", async () => {
        it("returns the user's name, username, and id when valid details are posted.", async () => {
            const data: UserRegister = { name: "Bilbo Baggins", username: "bilbo@baggins.com", password: "Prec1ous!" }

            const response = await supertest(app)
                .post("/api/user/register")
                .send(data)

            expect(response.statusCode).toBe(200)
            expect(response.body.name).toBe(data.name)
            expect(response.body.username).toBe(data.username)
            expect(response.body.password).toBeUndefined()
            expect(response.body.id).toMatch(new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/))
        })
    })
})
