import Redis from 'ioredis'
import { IRedisRepository, IRepository } from '../interface'

export abstract class BaseRepositoryRedis implements IRedisRepository {
  constructor(protected readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key)
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error)
      return null
    }
  }

  async set(key: string, value: string, expirationSeconds?: number): Promise<boolean> {
    try {
      if (expirationSeconds) {
        await this.redis.setex(key, expirationSeconds, value)
      } else {
        await this.redis.set(key, value)
      }
      return true
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(key)
      return result > 0
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error)
      return false
    }
  }

  // ✅ Utility methods
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error)
      return false
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key)
    } catch (error) {
      console.error(`Redis TTL error for key ${key}:`, error)
      return -1
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.redis.expire(key, seconds)
      return result === 1
    } catch (error) {
      console.error(`Redis EXPIRE error for key ${key}:`, error)
      return false
    }
  }

  // ✅ JSON helpers
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.get(key)
    if (!data) return null
    
    try {
      return JSON.parse(data) as T
    } catch (error) {
      console.error(`JSON parse error for key ${key}:`, error)
      return null
    }
  }

  async setJson<T>(key: string, value: T, expirationSeconds?: number): Promise<boolean> {
    try {
      const jsonString = JSON.stringify(value)
      return await this.set(key, jsonString, expirationSeconds)
    } catch (error) {
      console.error(`JSON stringify error for key ${key}:`, error)
      return false
    }
  }

  // ✅ Batch operations
  async mget(keys: string[]): Promise<(string | null)[]> {
    try {
      return await this.redis.mget(...keys)
    } catch (error) {
      console.error(`Redis MGET error:`, error)
      return keys.map(() => null)
    }
  }

  async mdel(keys: string[]): Promise<boolean> {
    try {
      await this.redis.del(...keys)
      return true
    } catch (error) {
      console.error(`Redis MDEL error:`, error)
      return false
    }
  }
}