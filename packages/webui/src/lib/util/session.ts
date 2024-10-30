import { type ClientSession } from "common"

export function getSession() {
    const cookieString = decodeURIComponent(document.cookie)
    const parts = cookieString.match(/^([a-zA-Z]*)=j:(.*)$/)
    if (parts?.length == 3) {
        return JSON.parse(parts[2])
    }
}
