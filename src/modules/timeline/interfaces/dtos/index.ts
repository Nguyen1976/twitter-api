import z from 'zod'

export const UpdateTimelineOnTweetCreatedSchema = z.object({
  tweetId: z.string().uuid(),
  userId: z.string().uuid(),
})

export type UpdateTimelineOnTweetCreatedDTO = z.infer<typeof UpdateTimelineOnTweetCreatedSchema>

export const UpdateTimelineOnFollowCreatedSchema = z.object({
  followerId: z.string().uuid(),
  followeeId: z.string().uuid(),
})

export type UpdateTimelineOnFollowCreatedDTO = z.infer<typeof UpdateTimelineOnFollowCreatedSchema>



export const TimelineUpdateSchema = z.object({
  tweets: z.array(UpdateTimelineOnTweetCreatedSchema),
})
export type TimelineUpdateDTO = z.infer<typeof TimelineUpdateSchema>

export type TimelineCondDTO = {
    userId: any
    tweetId: any
}
