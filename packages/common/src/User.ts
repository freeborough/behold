import { z } from "zod"
import { Result } from "./Result"

export const UserIdSchema = z.string().uuid()

export const UserRecordSchema = z.object({
    id: UserIdSchema,
    name: z.string().trim().min(1).max(255),
    username: z.string().trim().email(),
    password: z.string().min(8).max(18),
})

export const UserCreateSchema = UserRecordSchema.partial({ id: true })
export const UserUpdateSchema = UserRecordSchema.partial()
export const UserRegisterSchema = UserRecordSchema.omit({ id: true })
export const UserLoginSchema = UserRecordSchema.pick({ username: true, password: true })
export const UserSchema = UserRecordSchema.omit({ password: true })
export const UserPublicSchema = UserRecordSchema.pick({ id: true, name: true })

// On the client we want to confirm the entered password.
export const UserRegisterClientSchema = UserRegisterSchema.extend({
    passwordConfirmation: z.string()
}).refine((u) => u.password === u.passwordConfirmation, { message: "Must be the same as password.", path: ["passwordConfirmation"] })

export type UserRecord = z.infer<typeof UserRecordSchema>
export type UserId = z.infer<typeof UserIdSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>
export type UserRegister = z.infer<typeof UserRegisterSchema>
export type UserLogin = z.infer<typeof UserLoginSchema>
export type User = z.infer<typeof UserSchema>
export type UserPublic = z.infer<typeof UserPublicSchema>
export type UserRegisterClient = z.infer<typeof UserRegisterClientSchema>
