// setupAuth.ts
import { buildAuthInfrastructure } from './auth.infras'
import { buildAuthUseCases } from './auth.usecases'
import { buildAuthRouter } from './auth.routes'
import { Sequelize } from 'sequelize'
import Redis from 'ioredis'
import { init } from './infra/sequelize'

export function setupAuth(sequelize: Sequelize, redis: Redis) {
  init(sequelize)
  const infra = buildAuthInfrastructure(sequelize, redis)
  const usecases = buildAuthUseCases(infra)
  return buildAuthRouter(usecases)
}
