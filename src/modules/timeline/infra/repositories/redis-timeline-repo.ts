import { BaseRepositoryRedis } from '~/share/repository/redis'
import Redis from 'ioredis'
import { ITimelineRedisRepository } from '../../interfaces/TimelineRepositories'

export class RedisTimelineRepository
  extends BaseRepositoryRedis
  implements ITimelineRedisRepository
{
  constructor(redis: Redis) {
    super(redis)
  }
}
