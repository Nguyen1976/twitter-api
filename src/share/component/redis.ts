import Redis from 'ioredis'
import { config } from './config'

class RedisConnection {
  private static instance: Redis

  public static getInstance(): Redis {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        enableReadyCheck: false,
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        // Connection pool settings
        family: 4,
        keepAlive: 0, 
      })

      // Event listeners
      RedisConnection.instance.on('connect', () => {
        console.log('Redis connected successfully')
      })

      RedisConnection.instance.on('error', (err) => {
        console.error('Redis connection error:', err)
      })

      RedisConnection.instance.on('ready', () => {
        console.log('Redis is ready to use')
      })
    }

    return RedisConnection.instance
  }

  public static async connect(): Promise<void> {
    const redis = RedisConnection.getInstance()
    try {
      await redis.connect()
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      throw error
    }
  }

  public static async disconnect(): Promise<void> {
    if (RedisConnection.instance) {
      await RedisConnection.instance.disconnect()
      console.log('Redis disconnected')
    }
  }
}

export const redis = RedisConnection.getInstance()
export default RedisConnection
