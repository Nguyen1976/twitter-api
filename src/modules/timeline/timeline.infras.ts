import Redis from 'ioredis'
import { RedisTimelineRepository } from './infra/repositories/redis-timeline-repo'
import { Db } from 'mongodb'
import { MongoDBTimelineRepository } from './infra/repositories/mongo-timeline-db'

export function buildTimelineInfrastructure(redis: Redis, mongoDB: Db) {
  return {
    timelineRedisRepository: new RedisTimelineRepository(redis),
    timelineMongoDBRepository: new MongoDBTimelineRepository(mongoDB),
  }
}
