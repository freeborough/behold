import { z } from "zod"

export const LayerSchema = z.object({
    id: z.string().uuid(),
    scene_id: z.string().uuid(),
    name: z.string().max(255),
})

export const LayerIdSchema = LayerSchema.pick({ id: true })
export const LayerCreateSchema = LayerSchema.partial({ id: true })
export const LayerUpdateSchema = LayerSchema.partial()

export type Layer = z.infer<typeof LayerSchema>
export type LayerId = z.infer<typeof LayerIdSchema>
export type LayerCreate = z.infer<typeof LayerCreateSchema>
export type LayerUpdate = z.infer<typeof LayerUpdateSchema>
