import { z } from 'zod'

export const UserSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string(),
    isVerified: z.boolean().default(false),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
})

export type User = z.infer<typeof UserSchema>

export const UserCreateDTOSchema = z.object({
    username: z.string().min(7).max(50),
    email: z.string(),
    password: z.string(),
    isVerified: z.boolean().default(false)
})

export type UserCreateDTO = z.infer<typeof UserCreateDTOSchema>

export const UserUpdateDTOSchema = z.object({
    username: z.string().min(7).max(50).optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    isVerified: z.boolean().optional()
})
export type UserUpdateDTO = z.infer<typeof UserUpdateDTOSchema>

export type UserCondDTO = {}