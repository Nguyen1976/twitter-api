import { IQueryHandler } from '~/share/interface'
import { CheckEmailQuery } from '../interfaces/userQueries'
import { IUserRepository } from '../interfaces/userRepository'

export class CheckEmailQueryHandler
  implements IQueryHandler<CheckEmailQuery, boolean>
{
  constructor(
    private readonly repository: IUserRepository,
  ) {}

  async query(query: CheckEmailQuery): Promise<boolean> {
    const isExist = await this.repository.findByCond({
      email: query.dto.email
    })
    return !!isExist
  }
}
