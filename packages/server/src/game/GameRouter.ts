import express, { Request, Response } from "express"
import { ServerGameStore, GameStorePostgres } from "./GameStorePostgres"
import { sendResult } from "../util/results"
import { isAuthenticated } from "../middleware/isAuthenticated"
import { GameCreate, GameCreatePublic } from "common"

export function gameRouter(gameStore: ServerGameStore = new GameStorePostgres()): express.Router {
    const router = express.Router()

    // Creates a new game for the logged-in user.
    router.post("/create", isAuthenticated, async (request, response) => {
        if (request.session.user !== undefined) {
           sendResult(response, await gameStore.create({
                owner_id: request.session.user.id,
                ...request.body as GameCreatePublic
            }))
        }
    })

    router.get("/", isAuthenticated, async (request, response) => {
        if (request.session.user !== undefined) {
            sendResult(response, await gameStore.findByUserId(request.session.user.id))
        }
    })

    return router
}