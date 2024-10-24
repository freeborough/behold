import { type User } from "common"

export type Session = {
    user?: User
}

export const session: Session = $state({})
