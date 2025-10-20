import Redis from 'ioredis'
import { config } from './config'

class RedisConnection {
  private instance: Redis | undefined

  getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        enableReadyCheck: false,
        lazyConnect: true,
        maxRetriesPerRequest: null,
        // Connection pool settings
        family: 4,
        keepAlive: 0, 
      })

      // Event listeners
      this.instance.on('connect', () => {
        console.log('Redis connected successfully')
      })

      this.instance.on('error', (err) => {
        console.error('Redis connection error:', err)
      })

      this.instance.on('ready', () => {
        console.log('Redis is ready to use')
      })
    }

    return this.instance
  }

  async connect(): Promise<void> {
    const redis = this.getInstance()
    try {
      await redis.connect()
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect()
      console.log('Redis disconnected')
    }
  } 
}

export default RedisConnection
