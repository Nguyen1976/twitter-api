import { NextFunction, Request, Response } from 'express'
import { CreateTweetSchema } from '../../dtos'
import { ICommandHandler } from '~/share/interface'
import { CreateTweetCommand } from '../../tweetCommands'
import { Tweet } from '~/modules/tweet/domain/entities'
import { AuthRequest } from '~/share/middleware/auth'

export class TweetController {
  constructor(
    private readonly createTweetUsecase: ICommandHandler<
      CreateTweetCommand,
      Tweet
    >
  ) {}

  async createTweet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { success, data, error } = await CreateTweetSchema.safeParse({
        ...req.body,
        userId: req?.user?.id,
        video: Array.isArray(req?.files)
          ? null
          : (req.files as Record<string, Express.Multer.File[]>)?.video?.[0] ??
            null,
        images: Array.isArray(req?.files)
          ? null
          : (req.files as Record<string, Express.Multer.File[]>)?.images ?? [],
      })
      if (!success || error) {
        res.status(400).json({ success: false, error })
        return
      }

      //call usecase
      const result = await this.createTweetUsecase.execute({ dto: data })
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      console.error('Error creating tweet:', error)
      next(error)
    }
  }

  async replyTweet() {}

  async reQuoteTweet() {}

  async rePostTweet() {}
}
