import Redis from 'ioredis'
import { buildTimelineInfrastructure } from './timeline.infras'
import { buildTweetUseCases } from './timeline.usecases'
import { TimelineEventSubscriber } from './interfaces/rabbitmq/subscribers/timelineEventSubcriber'

export function setupTimelineModule(redis: Redis) {
  const infra = buildTimelineInfrastructure(redis)

  const usecases = buildTweetUseCases(infra)

  const timelineEventSubscriber = new TimelineEventSubscriber(
    usecases.updateTimeline
  )
}
