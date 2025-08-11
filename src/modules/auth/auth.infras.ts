import Redis from "ioredis";
import { Sequelize } from "sequelize";
import { MySQLUserRepository } from "./infra/repositories/mysql-user-repo";
import { RedisUserRepository } from "./infra/repositories/redis-user-repo";
import { BcryptPasswordHashService } from "./infra/services/bcrypt.service";
import { JwtService } from "~/share/component/jwt";
import { EmailService } from "~/share/component/EmailService";
import { OtpService } from "~/share/component/otpService";
import { OtpQueueService } from "~/share/component/queue/otpQueueService";
import { UserProfileGrpcClient } from "./infra/grpc/client";


export function buildAuthInfrastructure(sequelize: Sequelize, redis: Redis) {
  return {
    repository: new MySQLUserRepository(sequelize),
    redisRepository: new RedisUserRepository(redis),
    passwordHashService: new BcryptPasswordHashService(),
    jwtService: new JwtService(),
    emailService: new EmailService(),
    otpService: new OtpService(redis),
    otpQueueService: new OtpQueueService(redis, new OtpService(redis), new EmailService()),
    userProfileGrpcClient: new UserProfileGrpcClient(),
  }
}
