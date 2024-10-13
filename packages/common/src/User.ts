import { z } from "zod"

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(255),
    password: z.string().max(255),
    salt: z.string()
})

export const UserIdSchema = UserSchema.pick({ id: true })
export const UserCreateSchema = UserSchema.partial({ id: true })
export const UserUpdateSchema = UserSchema.partial()

export type User = z.infer<typeof UserSchema>
export type UserId = z.infer<typeof UserIdSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>
