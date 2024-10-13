import { z } from "zod"

export const PieceSchema = z.object({
    id: z.string().uuid(),
    owner_id: z.string().uuid(),
    layer_id: z.string().uuid(),
    asset_id: z.string().uuid(),
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().int().finite(),
    rotation: z.number().finite().min(0).max(360),
    scale: z.number().positive().finite(),
    visible: z.boolean(),
})

export const PieceIdSchema = PieceSchema.pick({ id: true })
export const PieceCreateSchema = PieceSchema.partial({ id: true })
export const PieceUpdateSchema = PieceSchema.partial()