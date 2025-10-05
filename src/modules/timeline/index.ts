import Redis from 'ioredis'
import { buildTimelineInfrastructure } from './timeline.infras'
import { buildTweetUseCases } from './timeline.usecases'
import { TimelineEventSubscriber } from './interfaces/rabbitmq/subscribers/timelineEventSubcriber'
import { Channel } from 'amqplib'

export function setupTimelineModule(redis: Redis, channel: Channel) {
  const infra = buildTimelineInfrastructure(redis)

  const usecases = buildTweetUseCases(infra)

  const timelineEventSubscriber = new TimelineEventSubscriber(
    usecases.updateTimeline,
    channel
  ).subscribeTweetEvents()
}
