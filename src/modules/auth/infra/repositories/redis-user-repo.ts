import { BaseRepositoryRedis } from '~/share/repository/redis'
import { IUserRedisRepository } from '../../interfaces/userRepository'
import Redis from 'ioredis'

export class RedisUserRepository
  extends BaseRepositoryRedis
  implements IUserRedisRepository
{
  constructor(redis: Redis) {
    super(redis)
  }
}
