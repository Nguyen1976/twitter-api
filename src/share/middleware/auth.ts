import { Request, Response, NextFunction } from 'express'
import { IJwtService } from '../interface'
import { config } from '~/share/component/config'
import { InvalidTokenError } from '../errors'

export interface AuthRequest extends Request {
  user?: {
    id: string
    username: string
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
      const token = this.extractToken(req)
      if (!token) {
        res.status(401).json({ success: false, message: 'Token required' })
        return
      }

      const payload = this.jwtService.verifyToken(
        token,
        config.jwt.accessTokenSecretKey
      )
      if (!payload) {
        res
          .status(401)
          .json(new InvalidTokenError().message)
        return
      }

      req.user = {
        id: payload.userId,
        username: payload.username,
      }

      next()
    } catch (error) {
      res.status(401).json({ success: false, message: 'Authentication failed' })
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization
    return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  }
}

// Factory function để tạo middleware
export const createAuthMiddleware = (jwtService: IJwtService) => {
  const middleware = new AuthMiddleware(jwtService)
  return middleware.authenticate
}
