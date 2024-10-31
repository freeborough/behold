import { Request, Response, NextFunction } from "express"
import { log } from "../util/log"

export function logger(request: Request, response: Response, next: NextFunction) {
    const message = `${request.method} ${request.path}`
    log.http(message)
    next()
}
