import { NextFunction, Request, Response } from 'express'
import { CheckEmailQuery, CheckUsernameQuery, CreateCommand, LoginResponse, LoginUserQuery, VerifyTokenResponse } from '..'
import {
  CheckEmailSchema,
  CheckUsernameSchema,
  UserCreateDTOSchema,
  UserLoginDTOSchema,
} from '../dtos/dto'
import { ICommandHandler, IQueryHandler } from '~/share/interface'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/share/component/ApiError'

export class AuthController {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>,
    private readonly loginQueryHandler: IQueryHandler<
      LoginUserQuery,
      LoginResponse
    >,
    private readonly refreshTokenCmdHandler: ICommandHandler<string, string>,
    private readonly checkEmailQueryHandler: IQueryHandler<CheckEmailQuery, boolean>,
    private readonly checkUsernameQueryHandler: IQueryHandler<CheckUsernameQuery, boolean>,
  ) {}

  async createAPI(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { success, data, error } = UserCreateDTOSchema.safeParse(req.body)
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      const result = await this.createCmdHandler.execute({ dto: data })
      res.status(201).json({ data: result })
    } catch (error) {
      next(error)
    }
  }

  async loginAPI(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { success, data, error } = UserLoginDTOSchema.safeParse(req.body)
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      const query: LoginUserQuery = { dto: data }
      const result = await this.loginQueryHandler.query(query as any)

      res.status(200).json({
        data: result,
      })

    } catch (error) {
      next(error)
    }
  }

  async refreshTokenAPI(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.body.refreshToken
      if (!refreshToken) {
        next(new ApiError(StatusCodes.FORBIDDEN, 'Refresh token is required or expired'))//Lỗi 403 cho refresh token hết hạn
        return
      }

      const newAccessToken = await this.refreshTokenCmdHandler.execute(refreshToken)
      res.status(200).json({ accessToken: newAccessToken })
    } catch (error: any) {
        next(new ApiError(StatusCodes.FORBIDDEN, error.message))
    }
  }

  async checkEmailAPI(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { success, data, error } = CheckEmailSchema.safeParse(req.body)
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }

      const query: CheckEmailQuery = { dto: data }
      const result = await this.checkEmailQueryHandler.query(query)

      res.status(200).json({
        data: result,
      })

    } catch (error) {
      next(error)
    }
  }

  async checkUsernameAPI(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { success, data, error } = CheckUsernameSchema.safeParse(req.body)
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }

      const query: CheckUsernameQuery = { dto: data }
      const result = await this.checkUsernameQueryHandler.query(query)

      res.status(200).json({
        data: result,
      })

    } catch (error) {
      next(error)
    }
  }

  async sendVerificationAPI(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
    } catch (error) {
      
    }
  }
}