import { BaseRepositoryRedis } from '~/share/repository/redis'
import { IUserRedisRepository } from '../../interfaces/userRepository'

export class RedisUserRepository
  extends BaseRepositoryRedis
  implements IUserRedisRepository
{
  constructor(redis: any) {
    super(redis)
  }
}
