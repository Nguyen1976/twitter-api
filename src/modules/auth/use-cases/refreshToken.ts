import { ICommandHandler, IJwtService } from '~/share/interface'
import { IUserRepository } from '../interfaces'
import { config } from '~/share/component/config'
import {
  RefreshTokenExpiredError,
  RefreshTokenInvalidError,
  UserNotFoundError,
} from '../domain/errors/user-errors'

export class RefreshTokenCmdHandler implements ICommandHandler<string, string> {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<string> {
    // 1. Verify the refresh token
    const decoded = this.jwtService.verifyToken(
      refreshToken,
      config.jwt.refreshTokenSecretKey
    )
    if (!decoded) {
      throw new RefreshTokenInvalidError()
    }
    if (this.isTokenExpired(decoded)) {
      // ✅ Throw expired error cố định
      throw new RefreshTokenExpiredError()
    }

    // 2. Check if the user exists
    const user = await this.userRepository.findByCond({ id: decoded.userId })
    if (!user) {
      throw new UserNotFoundError()
    }

    // 3. Generate a new access token
    const newAccessToken = this.jwtService.generateToken(
      {
        userId: user.id,
        username: user.username,
      },
      config.jwt.accessTokenSecretKey,
      config.jwt.accessTokenExpiresIn
    )

    return newAccessToken
  }
  private isTokenExpired(payload: any): boolean {
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000)
      return payload.exp < now
    }
    return false
  }
}
