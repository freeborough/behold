import type { Result, Game } from "common"
import { issue } from "common"
import { clientErrorToIssue } from "$lib/util/results"
import { post, get } from "$lib/rest/common"

const url = "/api/game"

export class GameClient {
    static async all(): Promise<Result<Game[]>> {
        try {
            return await get(`${url}/all`)
        } catch(e) {
            return issue(clientErrorToIssue(e as Error))
        }
    }
}
