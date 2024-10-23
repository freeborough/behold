import type { Result, UserRegister, User } from "common"
import { ok, issue, Issue, IssueKind, UserRegisterSchema } from "common";

const url = "/api/user"
const headers = new Headers()
headers.append("Content-Type", "application/json")

export class UserClient {
    static async register(details: UserRegister): Promise<void> {
        try {
            const parsedDetails = UserRegisterSchema.parse(details)
            const response = await fetch(`${url}/register`, {
                method: "POST",
                body: JSON.stringify(parsedDetails),
                headers,
            })
        
            if (response.ok) {
                const user = await response.json()
                console.log(user)
            } else {
                console.error(`ERROR: ${response.status} - ${response.statusText}`)
            }
            
        } catch(e) {
            console.error(e)
        }
    }
}
