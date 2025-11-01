import { IQueryHandler } from '~/share/interface'
import { UserNotFoundError } from '../domain/errors/user-errors'
import { GetUserQuery, IGetUserResponse, IUserRepository } from '../domain/ports'

export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, IGetUserResponse>
{
  constructor(private readonly repository: IUserRepository) {}

  async query(query: GetUserQuery): Promise<IGetUserResponse> {
    // 1. Tìm user theo id
    const user = await this.repository.findByCond({
      id: query.dto.userId,
    })
    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      birthDate: new Date(user.birthDate).toISOString(),
    } as IGetUserResponse
  }
}
