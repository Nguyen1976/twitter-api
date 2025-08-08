import { Sequelize } from 'sequelize'
import { initUserProfile } from './infra/sequelize'
import { Router } from 'express'
import { UserProfileController } from './interfaces/controllers'
import { MySQLUserProfileRepository } from './infra/repositories/my-sql-user-profile'
import { CreateUserProfileCmdHandler } from './use-cases/create'

export const setupUserProfile = (sequelize: Sequelize) => {
  initUserProfile(sequelize)

  const router = Router()

  const repository = new MySQLUserProfileRepository(sequelize)

  const createUserProfileCmdHandler = new CreateUserProfileCmdHandler(
    repository
  )

  const userProfileController = new UserProfileController(
    createUserProfileCmdHandler
  )

  router.post(
    '/profile',
    userProfileController.createAPI.bind(userProfileController)
  )

  return router
}
