import { z } from 'zod'

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().max(200).optional(),
  avatarUrl: z.string().url().max(200).optional(),
  headerImageUrl: z.string().url().max(200).optional(),
  followerCount: z.number().int().nonnegative().default(0),
  followingCount: z.number().int().nonnegative().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type UserProfile = z.infer<typeof UserProfileSchema>

export const UserProfileCreateDTOSchema = z.object({
  userId: z.string().uuid(),
}) //chỉ cần userId khi tạo mới profile sẽ được  tạo trong auth service khi tạo tài khoản tương lại có thể update thêm 1 số trường và chủ yếu những trường trong này sẽ được cập nhật sau khi người dùng đăng nhập

export type UserProfileCreateDTO = z.infer<typeof UserProfileCreateDTOSchema>

export const UserProfileUpdateDTOSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().max(200).optional(),
  avatarUrl: z.string().url().max(200).optional(),
  headerImageUrl: z.string().url().max(200).optional(),
  followerCount: z.number().int().nonnegative().optional(),
  followingCount: z.number().int().nonnegative().optional(),
})

export type UserProfileUpdateDTO = z.infer<typeof UserProfileUpdateDTOSchema>

export type UserProfileCondDTO = {}
