import { Sequelize } from 'sequelize'
import { initUserProfile } from './infra/sequelize'
import { buildUserRouter } from './user.routes'
import { buildUserUseCases } from './user.usecases'
import { buildUserInfrastructure } from './user.infras'

export const setupUserProfile = (sequelize: Sequelize) => {
  initUserProfile(sequelize)

  const infras = buildUserInfrastructure(sequelize)

  const usecases = buildUserUseCases(infras)

  return buildUserRouter(usecases, infras)
}
