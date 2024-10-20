import { Request, Response, NextFunction } from "express"

export function isAuthenticated(request: Request, response: Response, next: NextFunction) {
    if (request.session.user !== undefined) {
        next()
    } else {
        response.status(403).json()
    }
}