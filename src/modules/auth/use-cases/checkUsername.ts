import { CheckUsernameQuery, IUserRepository } from '../interfaces'
import { IQueryHandler } from '~/share/interface'
export class CheckUsernameQueryHandler
  implements IQueryHandler<CheckUsernameQuery, boolean>
{
  constructor(
    private readonly repository: IUserRepository,
  ) {}

  async query(query: CheckUsernameQuery): Promise<boolean> {
    const isExist = await this.repository.findByCond({
      username: query.dto.username
    })
    if (isExist) {
      return false
    }

    return true
  }
}
