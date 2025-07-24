import { Request, Response } from 'express'
import { CreateCommand, LoginResponse, LoginUserQuery, VerifyTokenResponse } from '..'
import {
  UserCreateDTOSchema,
  UserLoginDTOSchema,
} from '../dtos/dto'
import { ICommandHandler, IQueryHandler } from '~/share/interface'

export class AuthController {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>,
    private readonly loginQueryHandler: IQueryHandler<
      LoginUserQuery,
      LoginResponse
    >,
    private readonly verifyTokenQueryHandler: ICommandHandler<string, string>
  ) {}

  async createAPI(req: Request, res: Response): Promise<void> {
    try {
      const { success, data, error } = UserCreateDTOSchema.safeParse(req.body)
      if (!success) {
        res.status(400).json({ error: error })
        return
      }
      const result = await this.createCmdHandler.execute({ dto: data })
      console.log("🚀 ~ index.ts:27 ~ result:", result)
      res.status(201).json({ data: result })
      console.log("🚀 ~ index.ts:28 ~ result:", result)
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async loginAPI(req: Request, res: Response): Promise<void> {
    try {
      const { success, data, error } = UserLoginDTOSchema.safeParse(req.body)
      if (!success) {
        res.status(400).json({ error: error })
        return 
      }
      const query: LoginUserQuery = { dto: data }
      const result = await this.loginQueryHandler.query(query as any)

      res.status(200).json({
        success: true,
        data: result,
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      })
    }
  }

  async refreshTokenAPI(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.body.refreshToken
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' })
        return
      }

      const newAccessToken = await this.verifyTokenQueryHandler.execute(refreshToken)
      res.status(200).json({ accessToken: newAccessToken })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      })
    }
  }
}
