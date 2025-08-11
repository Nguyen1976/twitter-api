import { NextFunction, Request, Response } from 'express'
import { CreateCommand } from '../../userProfileCommands'
import { ICommandHandler } from '~/share/interface'
import ApiError from '~/share/component/ApiError'
import { UserProfileCreateDTOSchema } from '../../dtos'
import { StatusCodes } from 'http-status-codes'

export class UserProfileController {
  constructor(
    private readonly createUserProfileCmdHandler: ICommandHandler<
      CreateCommand,
      string
    >
  ) {}
  async createAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, data, error } = UserProfileCreateDTOSchema.safeParse(
        req.body
      )

      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      const command: CreateCommand = { dto: data }
      const result = await this.createUserProfileCmdHandler.execute(command)
      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }
}
