import { Request, Response, NextFunction } from "express"
import { StatusCodes as HttpStatus } from "http-status-codes"

export function isAuthenticated(request: Request, response: Response, next: NextFunction) {
    if (request.session.user !== undefined) {
        next()
    } else {
        response.status(HttpStatus.FORBIDDEN).send()
    }
}
