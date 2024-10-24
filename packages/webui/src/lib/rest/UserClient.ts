import { z } from "zod"
import type { Result, UserRegisterClient, User } from "common"
import { ok, issue, Issue, IssueKind, UserRegisterClientSchema, zodToIssue } from "common";

const url = "/api/user"
const headers = new Headers()
headers.append("Content-Type", "application/json")

export class UserClient {
    static async register(details: UserRegisterClient): Promise<Result<User>> {
        try {
            const parsedDetails = UserRegisterClientSchema.parse(details)
            const response = await fetch(`${url}/register`, {
                method: "POST",
                body: JSON.stringify(parsedDetails),
                headers,
            })
        
            if (response.ok) {
                return ok(await response.json() as User)
            } else {
                return issue(await response.json() as Issue[])
            }
        } catch(e) {
            // TODO: Write a errorToIssue function for the client, similar to the server one.
            if (e instanceof z.ZodError) {
                return issue(zodToIssue(e))
            } else {
                return issue(new Issue("Internal system error.", IssueKind.INTERNAL, ""))
            }
        }
    }
}
