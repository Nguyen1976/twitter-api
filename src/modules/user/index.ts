import { Sequelize } from 'sequelize'
import { initUserProfile } from './infra/sequelize'
import { Router } from 'express'
import { UserProfileController } from './interfaces/http/controllers'
import { MySQLUserProfileRepository } from './infra/repositories/my-sql-user-profile'
import { CreateUserProfileCmdHandler } from './use-cases/create'
import { UserProfileGrpcServer } from './infra/grpc/server'
import { UserProfileGrpcController } from './interfaces/grpc/controllers'

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

export const setupUserProfileGrpc = (sequelize: Sequelize) => {
  initUserProfile(sequelize)

  const repository = new MySQLUserProfileRepository(sequelize)

  const createUserProfileCmdHandler = new CreateUserProfileCmdHandler(
    repository
  )

  const userProfileController = new UserProfileGrpcController(
    createUserProfileCmdHandler
  )

  const server = new UserProfileGrpcServer(userProfileController)
  return server
}
