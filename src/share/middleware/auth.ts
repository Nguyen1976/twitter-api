import { Request, Response, NextFunction } from 'express'
import { IJwtService } from '../interface'
import { config } from '~/share/component/config'
import { InvalidTokenError } from '../errors'
import ApiError from '../component/ApiError'
import { StatusCodes } from 'http-status-codes'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export class AuthMiddleware {
  constructor(private readonly jwtService: IJwtService) {}

  authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.cookies?.accessToken
      if (!token) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access token is required'))
        return
      }

      const payload = this.jwtService.verifyToken(
        token,
        config.jwt.accessTokenSecretKey
      )
      if (!payload) {//lỗi 401 nếu access token k hợp lệ
        next(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            new InvalidTokenError().message
          )
        )
        return
      }

      req.user = {
        id: payload.id,
        email: payload.email
      }

      next()
    } catch (error) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, new InvalidTokenError().message))
    }
  }

}

// Factory function để tạo middleware
export const createAuthMiddleware = (jwtService: IJwtService) => {
  const middleware = new AuthMiddleware(jwtService)
  return middleware.authenticate
}
