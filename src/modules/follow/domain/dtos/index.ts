import z from 'zod'

export const CreateFollowSchema = z.object({
  followerId: z.string().uuid(),
  followeeId: z.string().uuid(),
})
export type CreateFollowDTO = z.infer<typeof CreateFollowSchema>

export const UpdateFollowSchema = z.object({
  followerId: z.string().uuid(),
  followeeId: z.string().uuid(),
})

export type UpdateFollowDTO = z.infer<typeof UpdateFollowSchema>

export type FollowCondDTO = {}
