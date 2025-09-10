import { Request, Response } from 'express'
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

  async createTweet(req: AuthRequest, res: Response) {
    const data = await CreateTweetSchema.parse({
      ...req.body,
      userId: req?.user?.id,
      video: Array.isArray(req.files)
        ? undefined
        : (req.files as Record<string, Express.Multer.File[]>)?.video[0],
      images: Array.isArray(req.files)
        ? undefined
        : (req.files as Record<string, Express.Multer.File[]>)?.images ?? [],
    })

    //call usecase
    const result = await this.createTweetUsecase.execute({ dto: data })
    res.status(201).json({ success: true, data: result })
  }

  async replyTweet() {}

  async reQuoteTweet() {}

  async rePostTweet() {}
}
