import { ICommandHandler, IJwtService } from '~/share/interface'
import { IUserRepository } from '../interfaces'
import { config } from '~/share/component/config'

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
      throw new Error('Invalid refresh token')
    }

    // 2. Check if the user exists
    const user = await this.userRepository.findByCond({ id: decoded.userId })
    if (!user) {
      throw new Error('User not found')
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
}
