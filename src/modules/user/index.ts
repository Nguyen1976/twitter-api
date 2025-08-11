import { Sequelize } from 'sequelize'
import { initUserProfile } from './infra/sequelize'
import { Router } from 'express'
import { UserProfileController } from './interfaces/http/controllers'
import { MySQLUserProfileRepository } from './infra/repositories/my-sql-user-profile'
import { CreateUserProfileCmdHandler } from './use-cases/create'
import { UserProfileGrpcServer } from './infra/grpc/server'
import { UserProfileGrpcController } from './interfaces/grpc/controllers'
import { buildUserRouter } from './user.routes'
import { buildUserUseCases } from './user.usecases'
import { buildUserInfrastructure } from './user.infras'

export const setupUserProfile = (sequelize: Sequelize) => {
  initUserProfile(sequelize)

  const infras = buildUserInfrastructure(sequelize)

  const usecases = buildUserUseCases(infras)

  return buildUserRouter(usecases)
}
