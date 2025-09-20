import z, { string } from 'zod'
import { TweetType } from '../../domain/types'

export const CreateTweetSchema = z
  .object({
    userId: z.string().uuid(),
    contentText: z.string().max(280).optional(),
    type: z.nativeEnum(TweetType).default(TweetType.TWEET).optional(),
    parentTweetId: z.string().uuid().optional(),
    video: z.any().optional().nullable(),
    images: z.any().optional().nullable(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
  })
  .superRefine((data, ctx) => {
    if (data.video && data.images) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Chỉ được đăng tải video hoặc images',
        path: ['video'], // hoặc ["images"]
      })
    }
  })

export type CreateTweetDTO = z.infer<typeof CreateTweetSchema>

export const UpdateTweetSchema = z.object({
  contentText: z.string().max(280).optional(),
  mediaUrl: z.string().optional(),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional(),
})

export type UpdateTweetDTO = z.infer<typeof UpdateTweetSchema>

export type TweetCondDTO = {}
