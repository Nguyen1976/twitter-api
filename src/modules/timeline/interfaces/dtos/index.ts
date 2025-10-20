import z from 'zod'

export const UpdateTimelineSchema = z.object({
  tweetId: z.string().uuid(),
  userId: z.string().uuid(),
})

export type UpdateTimelineDTO = z.infer<typeof UpdateTimelineSchema>
