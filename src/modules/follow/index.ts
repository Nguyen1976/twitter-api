import { Db } from 'mongodb'
import { buildFollowUseCases } from './follow.usecases'
import { buildFollowInfrastructure } from './follow.infras'
import { buildFollowRouter } from './follow.routes'

export const setupFollow = (mongoDb: Db) => {
  const infras = buildFollowInfrastructure(mongoDb)

  const usecases = buildFollowUseCases(infras)

  return buildFollowRouter(usecases)
}
