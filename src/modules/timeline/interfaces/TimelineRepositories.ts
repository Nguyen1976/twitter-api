import { IRedisRepository, IRepository } from '~/share/interface'
import { Timeline } from '../domain/entities'
import { TimelineCondDTO, TimelineUpdateDTO } from './dtos'

export interface ITimelineRedisRepository extends IRedisRepository {}

export interface ITimelineMongoDBRepository
  extends IRepository<Timeline, TimelineCondDTO, TimelineUpdateDTO> {}
