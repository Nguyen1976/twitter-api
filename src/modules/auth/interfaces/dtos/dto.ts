import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string(),
  isVerified: z.boolean().default(false),
  birthDate: z.date(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type User = z.infer<typeof UserSchema>

export const UserCreateDTOSchema = z.object({
  username: z.string().min(7).max(50),
  email: z.string(),
  password: z.string(),
  isVerified: z.boolean().default(false),
  birthDate: z.date(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type UserCreateDTO = z.infer<typeof UserCreateDTOSchema>

export const UserUpdateDTOSchema = z.object({
  username: z.string().min(7).max(50).optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  isVerified: z.boolean().optional(),
})
export type UserUpdateDTO = z.infer<typeof UserUpdateDTOSchema>

export const UserLoginDTOSchema = z.object({
  username: z.string().min(7).max(50),
  password: z.string(),
})

export type UserLoginDTO = z.infer<typeof UserLoginDTOSchema>

export const CheckUsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ chứa chữ, số và _'),
})

export type CheckUsernameDTO = z.infer<typeof CheckUsernameSchema>

export const CheckEmailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

export type CheckEmailDTO = z.infer<typeof CheckEmailSchema>

export const SendVerificationOtpSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  username: z
    .string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(20, 'Username không được quá 20 ký tự'),
})
export type SendVerificationOtpDTO = z.infer<typeof SendVerificationOtpSchema>

// ✅ Schema cho verify OTP
export const VerifyOtpSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  otp: z
    .string()
    .length(6, 'OTP phải có 6 chữ số')
    .regex(/^\d{6}$/, 'OTP chỉ chứa số'),
})

export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>

export type UserCondDTO = {}
