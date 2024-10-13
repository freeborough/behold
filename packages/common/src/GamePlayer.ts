import { z } from "zod"

export const GamePlayerRoleSchema = z.enum(["gm", "player"])

export const GamePlayerSchema = z.object({
    id: z.string().uuid(),
    game_id: z.string().uuid(),
    user_id: z.string().uuid(),
    role: GamePlayerRoleSchema
})

export const GamePlayerIdSchema = GamePlayerSchema.pick({ id: true })
export const GamePlayerCreateSchema = GamePlayerSchema.partial({ id: true })
export const GamePlayerUpdateSchema = GamePlayerSchema.partial()

export type GamePlayerRole = z.infer<typeof GamePlayerRoleSchema>
export type GamePlayer = z.infer<typeof GamePlayerSchema>
export type GamePlayerCreate = z.infer<typeof GamePlayerCreateSchema>
export type GamePlayerUPdate = z.infer<typeof GamePlayerUpdateSchema>
