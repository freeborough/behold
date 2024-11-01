import "cookie-store"
import { type User } from "common"

export type Session = {
    user?: User
}

window.cookieStore.addEventListner("change", ({ changed }) => {
    for (const { name, value } of changed) {
        console.log(`${name} was set to ${value}`)
    }
})

export const session: Session = $state({})
