import { type Result, Issue, ok, issue } from "common"

export async function jsonFetch<T>(method: string, url: string | URL, parsedData: any): Promise<Result<T>> {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(parsedData),
        headers,
    })

    if (response.ok) {
        return ok(await response.json() as T)
    } else {
        return issue(await response.json() as Issue[])
    }
}

export async function post<T>(url: string | URL, parsedData: any): Promise<Result<T>> {
    return await jsonFetch<T>("POST", url, parsedData)
}
