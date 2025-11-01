import { BaseRepositoryRedis } from '~/share/repository/redis'
import Redis from 'ioredis'
import { IUserRedisRepository } from '../../domain/ports'

export class RedisUserRepository
  extends BaseRepositoryRedis
  implements IUserRedisRepository
{
  constructor(redis: Redis) {
    super(redis)
  }
}
