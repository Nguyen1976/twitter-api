import { NextFunction, Request, Response } from 'express'
import { CreateCommand } from '../../userProfileCommands'
import { ICommandHandler, IQueryHandler } from '~/share/interface'
import ApiError from '~/share/component/ApiError'
import { UserProfile, UserProfileCreateDTOSchema, UserProfileGetDTO } from '../../dtos'
import { StatusCodes } from 'http-status-codes'
import { GetUserProfileQuery } from '../../userProfileQueries'
import { GetUserResponse } from '~/share/interface/grpc/auth'

export class UserProfileController {
  constructor(
    private readonly createUserProfileCmdHandler: ICommandHandler<
      CreateCommand,
      string
    >,
    private readonly getUserProfileQueryHandler: IQueryHandler<
      GetUserProfileQuery,
      GetUserResponse & UserProfile
    >
  ) {}
  async createAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, data, error } = UserProfileCreateDTOSchema.safeParse(req.body)

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

  async getAPI(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { success, data, error } = UserProfileGetDTO.safeParse(req.params)

      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      const query = <GetUserProfileQuery>{ dto: data }
      const result = await this.getUserProfileQueryHandler.query(query)
      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }
}
