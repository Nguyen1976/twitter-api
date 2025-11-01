import { IJwtService, IQueryHandler } from '~/share/interface'
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from '../domain/errors/user-errors'
import { config } from '~/share/component/config'
import { IPasswordHashService, IUserRepository, LoginResponse, LoginUserQuery } from '../domain/ports'

export class LoginUserQueryHandler
  implements IQueryHandler<LoginUserQuery, LoginResponse>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly passwordHashService: IPasswordHashService,
    private readonly jwtService: IJwtService
  ) {}

  async query(query: LoginUserQuery): Promise<LoginResponse> {
    // 1. Tìm user theo email
    const user = await this.repository.findByCond({
      email: query.dto.email
    })
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
      id: user.id,
      email: user.email,
    }, config.jwt.accessTokenSecretKey, config.jwt.accessTokenExpiresIn)



    const refreshToken = this.jwtService.generateToken({
      id: user.id,
      email: user.email,
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
