import express, { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { SessionData } from "express-session"

import { ServerUserStore, UserStorePostgres } from "./UserStorePostgres"
import { sendResult } from "../util/results"
import { isAuthenticated } from "../middleware/isAuthenticated"
import { ClientSession } from "common"

// As we use a httpOnly cookie for our session id, we need to create another cookie that the client
// can use to determine things like whether they're logged in or not.  The server never uses this,
// it's just for the client.
//
// TODO: Can we make this a middleware that we run just before the response is sent?
function updateClientSession(request: Request, response: Response): Response {
    const clientSession: ClientSession = {}
    if (request.session.user !== undefined) {
        clientSession.user = request.session.user
    }

    return response.cookie("clientSession", clientSession)
}

/**
 * Creates and returns an express router that manages a REST API that wraps a UserStore.
 * 
 * @param userStore A UserStore instance to use to store the user data. Optional.  Defaults to using
 * a new UserStorePostgres.
 * 
 * @returns An Express router that will handle all the user API routes.
 * 
 * @example
 * app.use("/api/user", userRouter())
 */
export function userRouter(userStore: ServerUserStore = new UserStorePostgres()): express.Router {
    const router = express.Router()

    // Register a new user in the system.
    router.post("/register", async (request, response) => {
        const result = await userStore.register(request.body)
        if (result.ok) {
            request.session.user = result.value
        }

        sendResult(updateClientSession(request, response), result)
    })

    // Authenticate a user's credentials against the system.
    router.post("/authenticate", async (request, response) => {
        const result = await userStore.authenticate(request.body)
        if (result.ok) {
            request.session.user = result.value
        }

        sendResult(updateClientSession(request, response), result)
    })

    // Log the user out.
    router.post("/logout", isAuthenticated, async (request, response) => {
        delete request.session.user

        updateClientSession(request, response).status(StatusCodes.NO_CONTENT).send()
    })

    return router
}