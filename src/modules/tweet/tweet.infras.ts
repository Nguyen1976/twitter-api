import { Sequelize } from 'sequelize'
import { MySQLTweetRepository } from './infra/repositories/mysql.repository'
import { JwtService } from '~/share/component/jwt'
import { UploadImageQueueService } from './infra/queue/uploadTweetImagesQueue'
import { CloudinaryService } from '~/share/component/cloudinary'
import Redis from 'ioredis'
import { TweetEventPublisher } from '~/modules/tweet/infra/rabbitmq/publishers/tweetEventPublisher'
import { Channel } from 'amqplib'

export function buildTweetInfrastructure(sequelize: Sequelize, redis: Redis, channel: Channel) {
  let tweetRepository = new MySQLTweetRepository(sequelize)
  let cloudinaryService = new CloudinaryService()
  return {
    tweetRepository,
    cloudinaryService,
    jwtService: new JwtService(),
    uploadImageQueue: new UploadImageQueueService(
      redis,
      cloudinaryService,
      tweetRepository
    ),
    tweetEventPublisher: new TweetEventPublisher(channel),
  }
}
