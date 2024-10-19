import express from "express";
import { userRouter } from "./user";
import { sessionMiddleware } from "./middleware/sessionMiddleware";
 
export const app = express()
app.use(express.json())
app.use(sessionMiddleware)
app.use("/api/user", userRouter())
