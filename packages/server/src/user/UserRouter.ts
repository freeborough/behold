import express, { Request, Response } from "express"
import { UserRegisterSchema, IssueKind } from "common"
import type { User } from "common"
import { ServerUserStore, UserStorePostgres } from "./UserStorePostgres"
import { sendResult } from "../util/results"
import { authenticated } from "../middleware/authenticated"
import { StatusCodes } from "http-status-codes"

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

        sendResult(response, result)
    })

    // Authenticate a user's credentials against the system.
    router.post("/authenticate", async (request, response) => {
        const result = await userStore.authenticate(request.body)
        if (result.ok) {
            request.session.user = result.value
        }

        sendResult(response, result)
    })

    // Log the user out.
    router.post("/logout", authenticated, async (request, response) => {
        delete request.session.user
        response.status(StatusCodes.NO_CONTENT).send()
    })

    return router
}
