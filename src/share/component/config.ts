import dotenv from 'dotenv'
import { access } from 'fs'

dotenv.config()

export const config = {
  app: {
    port: process.env.PORT || 3001,
  },
  jwt: {
    accessTokenSecretKey: process.env.JWT_SECRET || 'default_secret',
    refreshTokenSecretKey:
      process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    accessTokenExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3309,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    dbType: process.env.DB_TYPE || 'mysql',
    dbName: process.env.DB_NAME || 'twitter',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6380',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6380'),
    password: process.env.REDIS_PASSWORD || '',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    address: process.env.ADMIN_EMAIL_ADDRESS,
    pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
    name: process.env.ADMIN_EMAIL_ADDRESS,
  },
  cloudinary: {
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
  },
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
    database: process.env.MONGODB_DATABASE || 'twitter',
  }
}
