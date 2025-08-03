import { IRepository, IRedisRepository } from '~/share/interface'
import { User, UserCondDTO, UserUpdateDTO } from './dtos/dto';


export interface IUserRepository
  extends IRepository<User, UserCondDTO, UserUpdateDTO> {}

export interface IUserRedisRepository extends IRedisRepository {}
