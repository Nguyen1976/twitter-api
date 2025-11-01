import { IRepository, IRedisRepository } from '~/share/interface'
import { User, UserCondDTO, UserUpdateDTO } from '../domain/dtos/dto'

export interface IUserRepository
  extends IRepository<User, UserCondDTO, UserUpdateDTO> {}

export interface IUserRedisRepository extends IRedisRepository {}

export interface IGetUserResponse {
  id: string
  username: string
  email: string
  birthDate: string
}
