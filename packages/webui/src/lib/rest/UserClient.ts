import { z } from "zod"
import type { Result, UserRegisterClient, UserLogin, User } from "common"
import { ok, issue, Issue, IssueKind, UserRegisterClientSchema, UserLoginSchema, zodToIssue } from "common"
import { clientErrorToIssue } from "$lib/util/results"
import { post } from "$lib/rest/common"

const url = "/api/user"

export class UserClient {
    static async register(details: UserRegisterClient): Promise<Result<User>> {
        try {
            const parsedDetails = UserRegisterClientSchema.parse(details)
            return await post(`${url}/register`, parsedDetails)
        } catch(e) {
            return issue(clientErrorToIssue(e as Error))
        }
    }

    static async login(details: UserLogin): Promise<Result<User>> {
        try {
            const parsedDetails = UserLoginSchema.parse(details)
            return await post(`${url}/login`, parsedDetails)
        } catch(e) {
            return issue(clientErrorToIssue(e as Error))
        }
    }
}
