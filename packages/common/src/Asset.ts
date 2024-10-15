import { z } from "zod"

export const AssetIdSchema = z.string().uuid()

export const AssetSchema = z.object({
    id: AssetIdSchema,
    owner_id: z.string().uuid(),
    name: z.string().max(255),
    url: z.string().url(),
    tags: z.array(z.string()).optional(),
})

export const AssetCreateSchema = AssetSchema.partial({ id: true })
export const AssetUpdateSchema = AssetSchema.partial()

export type Asset = z.infer<typeof AssetSchema>
export type AssetId = z.infer<typeof AssetIdSchema>
export type AssetCreate = z.infer<typeof AssetCreateSchema>
export type AssetUpdate = z.infer<typeof AssetUpdateSchema>
