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

export const setupAuth = (sequelize: Sequelize) => {
  init(sequelize)

  const repository = new MySQLUserRepository(sequelize)
  const passwordHashService = new BcryptPasswordHashService()

  const jwtService = new JwtService()

  const userUsecase = new CreateNewUserCmdHandler(
    repository,
    passwordHashService
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

  const authController = new AuthController(
    userUsecase,
    userLoginUsecase,
    refreshTokenCmdHandler
  )

  const router = Router()

  router.post('/users/register', authController.createAPI.bind(authController))
  router.post('/users/login', authController.loginAPI.bind(authController))
  router.post(
    '/users/refresh-token',
    authController.refreshTokenAPI.bind(authController)
  )

  return router
}
