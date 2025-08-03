import { IQueryHandler } from '~/share/interface'
import { CheckUsernameQuery } from '../interfaces/userQueries'
import { IUserRepository } from '../interfaces/userRepository'
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
