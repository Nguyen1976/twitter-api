import { Sequelize } from 'sequelize'
import { MySQLUserProfileRepository } from './infra/repositories/my-sql-user-profile'
import { AuthGrpcClient } from './infra/grpc/client'
import { JwtService } from '~/share/component/jwt'
import { CloudinaryService } from '~/share/component/cloudinary'
import Redis from 'ioredis'
import { UploadImageQueueService } from './infra/queue/updateUserImagesQueue'

export function buildUserInfrastructure(sequelize: Sequelize, redis: Redis) {
  const cloudinaryService = new CloudinaryService()
  const userProfileRepository = new MySQLUserProfileRepository(sequelize)

  return {
    repository: userProfileRepository,
    authGrpcClient: new AuthGrpcClient(),
    jwtService: new JwtService(),
    cloudinaryService: cloudinaryService,
    updateUserImagesQueue: new UploadImageQueueService(redis, cloudinaryService, userProfileRepository),
  }
}
