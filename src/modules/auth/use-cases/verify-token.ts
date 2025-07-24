import { IUserRepository, VerifyTokenQuery, VerifyTokenResponse } from '../interfaces'
import {
  InvalidTokenError,
  UserNotFoundError,
} from '../domain/errors/user-errors'
import { IQueryHandler } from '~/share/interface'
import { IJwtService } from '../domain/services'

export class VerifyTokenQueryHandler
  implements IQueryHandler<VerifyTokenQuery, VerifyTokenResponse>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtService: IJwtService
  ) {}

  async query(query: VerifyTokenQuery): Promise<VerifyTokenResponse> {
    const payload = this.jwtService.verifyToken(query.dto.token)
    if (!payload) {
      throw new InvalidTokenError()
    }

    const user = await this.repository.findByCond({ id: payload.userId })
    if (!user) {
      throw new UserNotFoundError()
    }

    

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    }
  }
}
