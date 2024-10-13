import { z } from "zod"

export const SceneSchema = z.object({
    id: z.string().uuid(),
    game_id: z.string().uuid(),
    name: z.string().max(255),
    visible: z.boolean(),
})

export const SceneIdSchema = SceneSchema.pick({ id: true })
export const SceneCreateSchema = SceneSchema.partial({ id: true })
export const SceneUpdateSchema = SceneSchema.partial()

export type Scene = z.infer<typeof SceneSchema>
export type SceneId = z.infer<typeof SceneIdSchema>
export type SceneCreate = z.infer<typeof SceneCreateSchema>
export type SceneUpdate = z.infer<typeof SceneUpdateSchema>
