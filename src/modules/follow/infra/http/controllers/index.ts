import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CreateFollowSchema } from '~/modules/follow/domain/dtos'
import { CreateFollowCommand } from '~/modules/follow/domain/ports/FollowCommands'
import ApiError from '~/share/component/ApiError'
import { ICommandHandler } from '~/share/interface'

export class FollowController {
  constructor(
    private readonly createFollowCmdHandler: ICommandHandler<
      CreateFollowCommand,
      boolean
    >
  ) {}

  async createFollowAPI(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, success, error } = CreateFollowSchema.safeParse(req.body)
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      const { followerId, followeeId } = data
      const result = await this.createFollowCmdHandler.execute({
        dto: {
          followerId,
          followeeId,
        },
      })
      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}
