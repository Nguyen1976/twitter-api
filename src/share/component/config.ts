import dotenv from 'dotenv'
import { access } from 'fs'

dotenv.config()

export const config = {
    app: {
        port: process.env.PORT || 3000
    },
    jwt: {
        accessTokenSecretKey: process.env.JWT_SECRET || 'default_secret',
        refreshTokenSecretKey: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
        accessTokenExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3309,
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'password',
        dbType: process.env.DB_TYPE || 'mysql',
        dbName: process.env.DB_NAME || 'twitter'
    }
}

