import { z } from "zod"

export const GameSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(255),
    description: z.string().max(1000).optional(),
    owner_id: z.string().uuid(),
    slug: z.string().max(255),
})

export const GameIdSchema = GameSchema.pick({ id: true })
export const GameCreateSchema = GameSchema.partial({ id: true })
export const GameUpdateSchema = GameSchema.partial()

export type Game = z.infer<typeof GameSchema>
export type GameId = z.infer<typeof GameIdSchema>
export type GameCreate = z.infer<typeof GameCreateSchema>
export type GameUpdate = z.infer<typeof GameUpdateSchema>
