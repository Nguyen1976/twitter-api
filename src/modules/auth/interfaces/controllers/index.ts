import { Request, Response } from 'express'
import { CreateCommand } from '..'
import { UserCreateDTOSchema } from '../dtos/dto'
import { ICommandHandler } from '~/share/interface'

export class UserController {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>
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
}
