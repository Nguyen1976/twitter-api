import z from 'zod'

export const UpdateTimelineSchema = z.object({
  tweetId: z.string().uuid(),
  userId: z.string().uuid(),
})

export type UpdateTimelineDTO = z.infer<typeof UpdateTimelineSchema>

export const TimelineUpdateSchema = z.object({
  tweets: z.array(UpdateTimelineSchema),
})
export type TimelineUpdateDTO = z.infer<typeof TimelineUpdateSchema>

export type TimelineCondDTO = {
    userId: any
    tweetId: any
}
