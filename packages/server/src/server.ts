import "dotenv/config"
import { app } from "./app"

const SERVER_NAME = process.env.SERVER_NAME || "Behold VTT Server"
const SERVER_PORT = parseInt(process.env.SERVER_PORT || "4791")
const SERVER_HOST = process.env.SERVER_HOST || "localhost"

export const server = app.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`[${SERVER_NAME}] listening on ${SERVER_HOST}:${SERVER_PORT}`)
})
