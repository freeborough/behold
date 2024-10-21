import express from "express";
import { userRouter } from "./user";
import { gameRouter } from "./game";
import { session } from "./middleware/session";
 
export const app = express()
app.use(express.json())
app.use(session)
app.use("/api/user", userRouter())
app.use("/api/game", gameRouter())
