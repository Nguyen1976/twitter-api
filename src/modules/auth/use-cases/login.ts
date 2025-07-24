import { IJwtService, IQueryHandler } from '~/share/interface'
import { IUserRepository, LoginResponse, LoginUserQuery } from '../interfaces'
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from '../domain/errors/user-errors'
import { IPasswordHashService } from '../domain/services/index'
import { config } from '~/share/component/config'

export class LoginUserQueryHandler
  implements IQueryHandler<LoginUserQuery, LoginResponse>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly passwordHashService: IPasswordHashService,
    private readonly jwtService: IJwtService
  ) {}

  async query(query: LoginUserQuery): Promise<LoginResponse> {
    // 1. Tìm user theo username
    const user = await this.repository.findByUsername(query.dto.username)
    if (!user) {
      throw new UserNotFoundError()
    }

    // 2. Verify password
    const isPasswordValid = await this.passwordHashService.compare(
      query.dto.password,
      user.password
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    // 3. Generate JWT token
    const accessToken = this.jwtService.generateToken({
      userId: user.id,
      username: user.username,
    }, config.jwt.accessTokenSecretKey, config.jwt.accessTokenExpiresIn)



    const refreshToken = this.jwtService.generateToken({
      userId: user.id,
      username: user.username,
    }, config.jwt.refreshTokenSecretKey, config.jwt.refreshTokenExpiresIn)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    }
  }
}
