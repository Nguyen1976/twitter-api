import Redis from 'ioredis'
import { buildTimelineInfrastructure } from './timeline.infras'
import { buildTweetUseCases } from './timeline.usecases'
import { TimelineEventSubscriber } from './interfaces/rabbitmq/subscribers/timelineEventSubcriber'
import { Channel } from 'amqplib'
import { Db } from 'mongodb'

export async function setupTimelineModule(
  redis: Redis,
  channel: Channel,
  mongoDB: Db
) {
  const infra = buildTimelineInfrastructure(redis, mongoDB)

  const usecases = buildTweetUseCases(infra)

  const timelineEventSubscriber = new TimelineEventSubscriber(
    usecases.updateTimelineOnTweetCreatedUseCase,
    usecases.updateTimelineOnFollowCreatedUseCase,
    channel
  )
  await timelineEventSubscriber.subscribeTweetCreatedEvents()
  await timelineEventSubscriber.subscribeFollowCreatedEvents()
}
