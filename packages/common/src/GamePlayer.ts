import { z } from "zod"

const GamePlayerIdSchema = z.string().uuid()

export const GamePlayerRoleSchema = z.enum(["gm", "player"])

export const GamePlayerSchema = z.object({
    id: GamePlayerIdSchema,
    game_id: z.string().uuid(),
    user_id: z.string().uuid(),
    role: GamePlayerRoleSchema
})

export const GamePlayerCreateSchema = GamePlayerSchema.partial({ id: true })
export const GamePlayerUpdateSchema = GamePlayerSchema.partial()

export type GamePlayerRole = z.infer<typeof GamePlayerRoleSchema>
export type GamePlayer = z.infer<typeof GamePlayerSchema>
export type GamePlayerId = z.infer<typeof GamePlayerIdSchema>
export type GamePlayerCreate = z.infer<typeof GamePlayerCreateSchema>
export type GamePlayerUPdate = z.infer<typeof GamePlayerUpdateSchema>
