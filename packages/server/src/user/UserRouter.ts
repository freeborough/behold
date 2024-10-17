import express, { Request, Response } from "express"
import { UserStore, UserRegisterSchema } from "common"
import { UserStorePostgres } from "./UserStorePostgres"

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

    // Try and register a new user in the system.
    router.post("/register", async (request, response) => {
        const safe = UserRegisterSchema.safeParse(request.body)

        if (safe.success) {
            try {
                const user = await userStore.register(safe.data)
                response.json(user)
            } catch(e) {
                // TODO: Handle underlying problems.
                console.error(e)
                response.status(500).send({
                    message: "Internal server error."
                })
            }
        } else {
            // TODO: Handle validation problems.
        }
    })

    return router
}
