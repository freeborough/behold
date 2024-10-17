import express from "express";
import { userRouter } from "./user";
 
export const app = express()
app.use(express.json())
app.use("/api/user", userRouter())
