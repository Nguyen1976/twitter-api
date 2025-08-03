import { Sequelize } from 'sequelize'
import { init } from './infra/sequelize'
import { AuthController } from './interfaces/controllers'
import { CreateNewUserCmdHandler } from './use-cases/register'
import { MySQLUserRepository } from './infra/repositories/mysql-user-repo'
import { Router } from 'express'
import { BcryptPasswordHashService } from './infra/services/bcrypt.service'
import { LoginUserQueryHandler } from './use-cases/login'
import { JwtService } from '~/share/component/jwt'
import { RefreshTokenCmdHandler } from './use-cases/refreshToken'
import { CheckEmailQueryHandler } from './use-cases/checkEmail'
import { CheckUsernameQueryHandler } from './use-cases/checkUsername'
import Redis from 'ioredis'
import { RedisUserRepository } from './infra/repositories/redis-user-repo'
import { EmailService } from '~/share/component/EmailService'
import { SendVerificationOtpCmdHandler } from './use-cases/sendVerificationOtp'
import { OtpService } from '~/share/component/otpService'
import { OtpQueueService } from '~/share/component/queue/otpQueueService'
import { VerifyOtpCmdHandler } from './use-cases/verifyOtp'

export const setupAuth = (sequelize: Sequelize, redis: Redis) => {
  init(sequelize)

  const repository = new MySQLUserRepository(sequelize)
  const redisRepository = new RedisUserRepository(redis) //đã được sử dụng trong otp cho việc lưu otp

  const passwordHashService = new BcryptPasswordHashService()
  const jwtService = new JwtService()
  const emailService = new EmailService()
  const otpService = new OtpService(redis)

  const otpQueueService = new OtpQueueService(redis, otpService, emailService)

  const userUsecase = new CreateNewUserCmdHandler(
    repository,
    passwordHashService,
    emailService
  )

  const userLoginUsecase = new LoginUserQueryHandler(
    repository,
    passwordHashService,
    jwtService
  )

  const refreshTokenCmdHandler = new RefreshTokenCmdHandler(
    jwtService,
    repository
  )

  const checkEmailQueryHandler = new CheckEmailQueryHandler(repository)

  const checkUsernameQueryHandler = new CheckUsernameQueryHandler(repository)

  const sendVerificationOtpCmdHandler = new SendVerificationOtpCmdHandler(
    repository,
    otpQueueService
  )

  const verifyOtpCmdHandler = new VerifyOtpCmdHandler(otpService)

  const authController = new AuthController(
    userUsecase,
    userLoginUsecase,
    refreshTokenCmdHandler,
    checkEmailQueryHandler,
    checkUsernameQueryHandler,
    sendVerificationOtpCmdHandler,
    verifyOtpCmdHandler
  )

  const router = Router()

  router.post('/auth/register', authController.createAPI.bind(authController))
  router.post('/auth/login', authController.loginAPI.bind(authController))
  router.post(
    '/auth/refresh-token',
    authController.refreshTokenAPI.bind(authController)
  )
  router.post(
    '/auth/check-email',
    authController.checkEmailAPI.bind(authController)
  )
  router.post(
    '/auth/check-username',
    authController.checkUsernameAPI.bind(authController)
  ) // Assuming this is similar to check email
  router.post(
    '/auth/send-verification',
    authController.sendVerificationAPI.bind(authController)
  )
  router.post(
    '/auth/verify-otp',
    authController.verifyOtpAPI.bind(authController)
  )
  //quy trình verified nhận vào otp và email username, check redis xem có otp không, nếu có thì so sánh với otp người dùng nhập vào

  //User tạo tài khoản gồm username, email và ngày tháng năm sinh
  //và sẽ check username có trùng lặp không, nếu trùng lặp thì sẽ báo lỗi
  //khi email không trùng lặp thì sẽ sang bước otp và tạo 1 otp mới và gửi mail
  //Người dùng verified otp thành công thì sẽ nhập mật khẩu và tạo tài khoản

  //khi register thành công sẽ cho user đăng nhập luôn tức là trả về token và thông tin user luôn gồm username

  return router
}
