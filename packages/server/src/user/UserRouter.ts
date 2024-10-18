import express, { Request, Response } from "express"
import { UserStore, UserRegisterSchema, IssueKind } from "common"
import type { User } from "common"
import { UserStorePostgres } from "./UserStorePostgres"
import { sendResult } from "../util/results"

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
export function userRouter(userStore: UserStore = new UserStorePostgres()): express.Router {
    const router = express.Router()

    // TODO: Create a user session if they successfully register / authenticate.

    // Register a new user in the system.
    router.post("/register", async (request, response) => {
        sendResult(response, await userStore.register(request.body))
    })

    // Authenticate a user's credentials against the system.
    router.post("/authenticate", async (request, response) => {
        sendResult(response, await userStore.authenticate(request.body))
    })

    return router
}
