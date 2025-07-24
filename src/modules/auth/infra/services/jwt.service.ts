
import jwt from 'jsonwebtoken'
import { IJwtService } from '../../domain/services'

export class JwtService implements IJwtService {
    private readonly secret = process.env.JWT_SECRET || 'your-secret-key'
    private readonly expiresIn = '24h'

    generateToken(payload: { userId: string, username: string }): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
    }

    verifyToken(token: string): { userId: string, username: string } | null {
        try {
            const decoded = jwt.verify(token, this.secret) as any
            return {
                userId: decoded.userId,
                username: decoded.username
            }
        } catch (error) {
            return null
        }
    }
}