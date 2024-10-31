import { type Result, Issue, ok, issue, IssueKind } from "common"
import { gotoLogin } from "$lib/util/navigation"

export async function jsonFetch<T>(method: string, url: string | URL, parsedData?: any): Promise<Result<T>> {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const init: RequestInit = {
        method: method,
        headers,        
    }

    if (parsedData != undefined) {
        init.body = JSON.stringify(parsedData)
    }

    const response = await fetch(url, init)

    if (response.ok) {
        return ok(await response.json() as T)
    } else {
        // If we're not authorised, redirect to the login page.
        if (response.status == 403) {
            gotoLogin()
            return issue(new Issue("Not authorised.", IssueKind.CONSTRAINT, "username"))
        } else {
            return issue(await response.json() as Issue[])
        }
    }
}

export async function post<T>(url: string | URL, parsedData: any): Promise<Result<T>> {
    return await jsonFetch<T>("POST", url, parsedData)
}

export async function get<T>(url: string | URL, parsedData?: any): Promise<Result<T>> {
    return await jsonFetch<T>("GET", url, parsedData)
}
