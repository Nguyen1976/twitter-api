import { CheckEmailQuery, IUserRepository } from '../interfaces'
import { IQueryHandler } from '~/share/interface'

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
    if (isExist) {
      return false
    }

    return true
  }
}
