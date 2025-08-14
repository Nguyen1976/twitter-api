import { NextFunction, Request, Response } from 'express'
import { LoginUserQuery } from '../../userQueries'
import { LoginResponse, SendVerificationOtpResponse } from '../../userResponses'
import { ICommandHandler, IQueryHandler } from '~/share/interface'
import {
  CreateCommand,
  SendVerificationOtpCommand,
  VerifyOtpCommand,
} from '../../userCommands'
import {
  SendVerificationOtpSchema,
  UserCreateDTOSchema,
  UserLoginDTOSchema,
  VerifyOtpSchema,
} from '../../dtos/dto'
import ApiError from '~/share/component/ApiError'
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'

export class AuthController {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>,
    private readonly loginQueryHandler: IQueryHandler<
      LoginUserQuery,
      LoginResponse
    >,
    private readonly refreshTokenCmdHandler: ICommandHandler<string, string>,
    private readonly sendVerificationOtpCmdHandler: ICommandHandler<
      SendVerificationOtpCommand,
      SendVerificationOtpResponse
    >,
    private readonly verifyOtpCmdHandler: ICommandHandler<
      VerifyOtpCommand,
      boolean
    >
  ) {}

  async createAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, data, error } = UserCreateDTOSchema.safeParse({
        ...req.body,
        birthDate: new Date(req.body.birthDate),
      })
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      const result = await this.createCmdHandler.execute({ dto: data })
      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error('Error in createAPI:', error)
      next(error)
    }
  }

  async loginAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, data, error } = UserLoginDTOSchema.safeParse(req.body)
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      const query: LoginUserQuery = { dto: data }
      const result = await this.loginQueryHandler.query(query as any)

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days'),
      })

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days'),
      })

      res.status(200).json({
        success: true,
        data: result.user,
      })
    } catch (error) {
      next(error)
    }
  }

  async refreshTokenAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken
      if (!refreshToken) {
        next(
          new ApiError(
            StatusCodes.FORBIDDEN,
            'Refresh token is required or expired'
          )
        )
        //Lỗi 403 cho refresh token hết hạn(client call api logout)
        return
      }

      const newAccessToken = await this.refreshTokenCmdHandler.execute(
        refreshToken
      )

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days'),
      })
      res.status(200).json({ success: true, data: newAccessToken })
    } catch (error: any) {
      next(new ApiError(StatusCodes.FORBIDDEN, error.message))
    }
  }

  async sendVerificationAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, data, error } = SendVerificationOtpSchema.safeParse(
        req.body
      )
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }

      const query: SendVerificationOtpCommand = { dto: data }
      const result = await this.sendVerificationOtpCmdHandler.execute(query)

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async verifyOtpAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, data, error } = VerifyOtpSchema.safeParse(req.body)
      if (!success) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
        return
      }
      const command: VerifyOtpCommand = { dto: data }
      const isValid: boolean = await this.verifyOtpCmdHandler.execute(command)

      res.status(200).json({
        success: true,
        data: isValid,
      })
    } catch (error) {
      next(error)
    }
  }

  async logoutAPI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.status(200).json({ success: true })
    } catch (error) {
      next(error)
    }
  }
}
