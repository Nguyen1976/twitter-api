import jwt from 'jsonwebtoken'
import { IJwtService, TokenPayload } from '../interface'

export class JwtService implements IJwtService {

    generateToken(payload: TokenPayload, secret: string, expiresIn?: string | number): string {
        return jwt.sign(
            payload,
            secret,
            { expiresIn } as any
        )
    }

    
    verifyToken(token: string, secret: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, secret) as TokenPayload
            return decoded
        } catch (error) {
            return null
        }
    }
}