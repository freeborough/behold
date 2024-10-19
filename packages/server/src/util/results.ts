import { Response } from "express"
import postgres from "postgres"
import { z } from "zod"
import { StatusCodes } from "http-status-codes"
import { Issue, IssueKind, Result, zodToIssue } from "common"

/**
 * Takes a Result and sends it as JSON with the correct status code, based on the Result being OK or
 * not and if not the kinds of issues found.
 * 
 * @param response The Express Response used to send.
 * @param result The Result to send.
 * 
 * @example
 * sendResult(response, await userStore.register(request.body))
 */
export function sendResult(response: Response, result: Result<any>) {
    if (result.ok) {
        response.status(StatusCodes.OK).json(result.value)
    } else {
        const status = result.issues.some(i => i.kind === IssueKind.INTERNAL) ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.BAD_REQUEST
        response.status(status).json(result.issues)
    }
}

/**
 * Takes an Error object and maps it to one or more Issue objects.  It specifically looks for and
 * handles Postgres and Zod errors (using {@link zodToIssue}).  Unknown errors are created as an
 * INTERNAL issue, which will also be logged to console.error.
 *
 * @param error The Error object to process.
 * @returns One or more Issue objects representing the issues found in the supplied Error.
 * 
 * @example
 * try {
 *   const parsed = myZodSchema.parse(data)
 * } catch(e) {
 *   issues.push(...errorToIssue(e))
 * }
 */
export function errorToIssue(error: Error): Issue[] {
    const issues: Issue[] = []

    if (error instanceof postgres.PostgresError) {
        // TODO: Support parsing more Postgres errors and constraint types.
        if ("constraint_name" in error && error.constraint_name != undefined) {
            const [table, field, constraint] = error.constraint_name.split("_")
            issues.push(new Issue(`${field} exists.`, IssueKind.CONSTRAINT, field))
        } else {
            console.error(error)
            issues.push(new Issue("Internal error.", IssueKind.INTERNAL, ""))    
        }
    } else if (error instanceof z.ZodError) {
        issues.push(...zodToIssue(error))
    } else {    
        console.error(error)
        issues.push(new Issue("Internal error.", IssueKind.INTERNAL, ""))
    }

    return issues
}