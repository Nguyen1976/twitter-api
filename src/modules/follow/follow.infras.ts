import { Db } from 'mongodb'
import { MongoDBFollowRepository } from './infra/repositories/mongo-follow-db'
import { FollowEventPublisher } from './infra/rabbitmq/publishers/followEventPublisher'
import { Channel } from 'amqplib'

export function buildFollowInfrastructure(mongoDB: Db, channel: Channel) {
  return {
    followMongoDBRepository: new MongoDBFollowRepository(mongoDB),
    followEventPublisher: new FollowEventPublisher(channel),
  }
}
