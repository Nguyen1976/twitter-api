import { Sequelize } from 'sequelize'
import { init } from './infra/sequelize'
import { UserController } from './interfaces/controllers'
import { CreateNewUserCmdHandler } from './use-cases/register'
import { MySQLUserRepository } from './infra/repositories/mysql-user-repo'
import { Router } from 'express'
import { BcryptPasswordHashService } from './infra/services/bcrypt.service'
import { LoginUserQueryHandler } from './use-cases/login'
import { JwtService } from './infra/services/jwt.service'
import { VerifyTokenQueryHandler } from './use-cases/verify-token'

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

  const verifyTokenUsecase = new VerifyTokenQueryHandler(repository, jwtService)

  const userController = new UserController(
    userUsecase,
    userLoginUsecase,
    verifyTokenUsecase
  )

  const router = Router()

  router.post('/users/register', userController.createAPI.bind(userController))
  router.post('/users/login', userController.loginAPI.bind(userController))
  router.get(
    '/users/verify-token',
    userController.verifyTokenAPI.bind(userController)
  )

  return router
}
