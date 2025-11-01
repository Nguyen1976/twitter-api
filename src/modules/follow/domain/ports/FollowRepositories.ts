import { IRepository } from '~/share/interface'
import { Follow } from '../entities/follow'
import { FollowCondDTO, UpdateFollowDTO } from '../dtos'

export interface IFollowMongoDBRepository
  extends IRepository<Follow, FollowCondDTO, UpdateFollowDTO> {}
