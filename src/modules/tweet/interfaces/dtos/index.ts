import z, { string } from 'zod'
import { TweetType } from '../../domain/types'

export const CreateTweetSchema = z.object({
  userId: z.string().uuid(),
  contentText: z.string().max(280).optional(),
  type: z.nativeEnum(TweetType).default(TweetType.TWEET).optional(),
  parentTweetId: z.string().uuid().optional(),
  video: z.any().optional(),
  images: z.any().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type CreateTweetDTO = z.infer<typeof CreateTweetSchema>

export const UpdateTweetSchema = z.object({
  contentText: z.string().max(280).optional(),
  updatedAt: z.date().default(() => new Date()),
})

export type UpdateTweetDTO = z.infer<typeof UpdateTweetSchema>

export type TweetCondDTO = {}
