import { z } from "zod"

export const LayerIdSchema = z.string().uuid()

export const LayerSchema = z.object({
    id: LayerIdSchema,
    scene_id: z.string().uuid(),
    name: z.string().max(255),
})

export const LayerCreateSchema = LayerSchema.partial({ id: true })
export const LayerUpdateSchema = LayerSchema.partial()

export type Layer = z.infer<typeof LayerSchema>
export type LayerId = z.infer<typeof LayerIdSchema>
export type LayerCreate = z.infer<typeof LayerCreateSchema>
export type LayerUpdate = z.infer<typeof LayerUpdateSchema>
