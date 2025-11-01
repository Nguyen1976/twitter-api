import Redis from 'ioredis'
import { Sequelize } from 'sequelize'
import { BcryptPasswordHashService } from './infra/services/bcrypt.service'
import { JwtService } from '~/share/component/jwt'
import { EmailService } from '~/share/component/EmailService'
import { OtpService } from '~/share/component/otpService'
import { OtpQueueService } from '~/share/component/queue/otpQueueService'
import { MySQLUserRepository } from './infra/repositories/mysql-user-repo'
import { RedisUserRepository } from './infra/repositories/redis-user-repo'
import { UserProfileGrpcClient } from './infra/grpc/client'

export function buildAuthInfrastructure(sequelize: Sequelize, redis: Redis) {
  const otpService = new OtpService(redis)
  const emailService = new EmailService()
  return {
    repository: new MySQLUserRepository(sequelize),
    redisRepository: new RedisUserRepository(redis),
    passwordHashService: new BcryptPasswordHashService(),
    jwtService: new JwtService(),
    emailService: emailService,
    otpService: otpService,
    otpQueueService: new OtpQueueService(redis, otpService, emailService),
    userProfileGrpcClient: new UserProfileGrpcClient(),
  }
}
