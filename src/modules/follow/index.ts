import { Db } from 'mongodb'
import { buildFollowUseCases } from './follow.usecases'
import { buildFollowInfrastructure } from './follow.infras'
import { buildFollowRouter } from './follow.routes'
import { Channel } from 'amqplib'

export const setupFollow = (mongoDb: Db, channel: Channel) => {
  const infras = buildFollowInfrastructure(mongoDb, channel)
  const usecases = buildFollowUseCases(infras)

  return buildFollowRouter(usecases)
}
