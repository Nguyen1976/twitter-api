import { Sequelize } from 'sequelize'
import { init } from './infra/sequelize'
import { UserController } from './interfaces/controllers'
import { CreateNewUserCmdHandler } from './use-cases/create-new'
import { MySQLUserRepository } from './infra/repositories/mysql-user-repo'
import { Router } from 'express'
import { BcryptPasswordHashService } from './infra/services/bcrypt.service'

export const setupAuth = (sequelize: Sequelize) => {
  init(sequelize)

  const repository = new MySQLUserRepository(sequelize)
  const passwordHashService = new BcryptPasswordHashService()

  const userUsecase = new CreateNewUserCmdHandler(repository, passwordHashService)

  const userController = new UserController(userUsecase)

  const router = Router()

  router.post('/users', userController.createAPI.bind(userController))

  return router
}
