import express from "express"
import proxy from "express-http-proxy"

import { userRouter } from "./user"
import { gameRouter } from "./game"
import { session } from "./middleware/session"
import { logger } from "./middleware/logger"

export const app = express()

app.use(express.json())
app.use(logger)
app.use(session)

app.use("/api/user", userRouter())
app.use("/api/game", gameRouter())
app.use("/", proxy("localhost:5173"))
