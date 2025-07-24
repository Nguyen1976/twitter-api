import { Request, Response } from 'express'
import { CreateCommand, LoginResponse, LoginUserQuery, VerifyTokenQuery, VerifyTokenResponse } from '..'
import {
  UserCreateDTOSchema,
  UserLoginDTOSchema,
} from '../dtos/dto'
import { ICommandHandler, IQueryHandler } from '~/share/interface'

export class UserController {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>,
    private readonly loginQueryHandler: IQueryHandler<
      LoginUserQuery,
      LoginResponse
    >,
    private readonly verifyTokenHandler: IQueryHandler<VerifyTokenQuery, VerifyTokenResponse>
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const { success, data, error } = UserCreateDTOSchema.safeParse(req.body)
      if (!success) {
        return res.status(400).json({ error: error })
      }
      const result = await this.createCmdHandler.execute({ dto: data })
      res.status(201).json({ data: result })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async loginAPI(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = UserLoginDTOSchema.parse(req.body)
      const query: LoginUserQuery = { dto: validatedData }
      const result = await this.loginQueryHandler.query(query as any)

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  async verifyTokenAPI(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '')
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token required',
        })
      }

      const query = { dto: { token } }
      const result = await this.verifyTokenHandler.query(query as any)

      return res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }
}
