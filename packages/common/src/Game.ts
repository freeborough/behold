import { z } from "zod"
import { Result } from "./Result"

export const GameIdSchema = z.string().uuid()

export const GameSchema = z.object({
    id: GameIdSchema,
    name: z.string().max(255),
    description: z.string().max(1000).optional(),
    owner_id: z.string().uuid(),
    slug: z.string().max(255),
})

export const GameCreateSchema = GameSchema.partial({ id: true })
export const GameUpdateSchema = GameSchema.partial()

export type Game = z.infer<typeof GameSchema>
export type GameId = z.infer<typeof GameIdSchema>
export type GameCreate = z.infer<typeof GameCreateSchema>
export type GameUpdate = z.infer<typeof GameUpdateSchema>

export interface GameStore {
    create(newGame: GameCreate): Promise<Result<Game>>
    update(id: GameId, data: GameUpdate): Promise<Result<Game>>
    remove(id: GameId): Promise<Result<Game>>
}
