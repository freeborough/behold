import session from "express-session";
import { User } from "common";

// Define the type of our session object.
declare module "express-session" {
    interface SessionData {
        user: User
    }
}

// TODO: Setup secure cookie and trust proxy when behind a reverse proxy using SSL.
export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    name: "session",
    resave: false,
    saveUninitialized: false,
})
