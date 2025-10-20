import Redis from 'ioredis'
import { RedisTimelineRepository } from './infra/repositories/redis-timeline-repo'

export function buildTimelineInfrastructure(redis: Redis) {
 
  return {
    timelineRepository: new RedisTimelineRepository(redis),
  }
}
