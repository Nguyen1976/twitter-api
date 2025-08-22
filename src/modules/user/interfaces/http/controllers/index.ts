import { NextFunction, Request, Response } from 'express'
import { CreateCommand, UpdateCommand } from '../../userProfileCommands'
import { ICommandHandler, IQueryHandler } from '~/share/interface'
import ApiError from '~/share/component/ApiError'
import {
  UserProfile,
  UserProfileCreateDTOSchema,
  UserProfileGetDTO,
  UserProfileUpdateDTOSchema,
} from '../../dtos'
import { StatusCodes } from 'http-status-codes'
import { GetUserProfileQuery } from '../../userProfileQueries'
import { GetUserResponse } from '~/share/interface/grpc/auth'
import { AuthRequest } from '~/share/middleware/auth'

export class UserProfileController {
  constructor(
    private readonly createUserProfileCmdHandler: ICommandHandler<
      CreateCommand,
      string
    >,
    private readonly getUserProfileQueryHandler: IQueryHandler<
      GetUserProfileQuery,
      GetUserResponse & UserProfile
    >,
    private readonly updateUserProfileCmdHandler: ICommandHandler<
      UpdateCommand,
      boolean
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

  async updateAPI(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, data, error } = UserProfileUpdateDTOSchema.safeParse({
        ...req.body,
        userId: req?.user?.id,
        avatarUrl: Array.isArray(req.files)
          ? undefined
          : (req.files as Record<string, Express.Multer.File[]>)?.avatarUrl?.[0],
        headerImageUrl: Array.isArray(req.files)
          ? undefined
          : (req.files as Record<string, Express.Multer.File[]>)?.headerImageUrl?.[0],
      })

      if (!success) {
        console.error('Validation error:', error.message)
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      
      const command: UpdateCommand = { dto: data }
      const result = await this.updateUserProfileCmdHandler.execute(command)
      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }
}
