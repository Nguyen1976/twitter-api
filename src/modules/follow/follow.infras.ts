import { Db } from 'mongodb'
import { MongoDBFollowRepository } from './infra/repositories/mongo-follow-db'

export function buildFollowInfrastructure(mongoDB: Db) {
  return {
    followMongoDBRepository: new MongoDBFollowRepository(mongoDB),
  }
}
