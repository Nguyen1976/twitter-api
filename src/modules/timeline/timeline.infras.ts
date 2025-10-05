import Redis from 'ioredis'

export function buildTimelineInfrastructure(redis: Redis) {
 
  return {
    redis,
  }
}
