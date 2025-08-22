import { Sequelize } from 'sequelize'
import { initUserProfile } from './infra/sequelize'
import { buildUserRouter } from './user.routes'
import { buildUserUseCases } from './user.usecases'
import { buildUserInfrastructure } from './user.infras'
import Redis from 'ioredis'

export const setupUserProfile = (sequelize: Sequelize, redis: Redis) => {
  initUserProfile(sequelize)

  const infras = buildUserInfrastructure(sequelize, redis)

  const usecases = buildUserUseCases(infras)

  return buildUserRouter(usecases, infras)
}
