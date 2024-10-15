import { z } from "zod"

export const PieceIdSchema = z.string().uuid()

export const PieceSchema = z.object({
    id: PieceIdSchema,
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

export const PieceCreateSchema = PieceSchema.partial({ id: true })
export const PieceUpdateSchema = PieceSchema.partial()

export type Piece = z.infer<typeof PieceSchema>
export type PieceId = z.infer<typeof PieceIdSchema>
export type PieceCreate = z.infer<typeof PieceCreateSchema>
export type PieceUpdate = z.infer<typeof PieceUpdateSchema>
