import { IRedisRepository, IRepository } from '~/share/interface'
import {
  CheckEmailDTO,
  CheckUsernameDTO,
  UserCondDTO,
  UserCreateDTO,
  UserLoginDTO,
  UserUpdateDTO,
} from './dtos/dto'

export interface User {
  id: string
  username: string
  email: string
  password: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IUserRepository
  extends IRepository<User, UserCondDTO, UserUpdateDTO> {}

export interface IUserRedisRepository extends IRedisRepository{}

export interface CreateCommand {
  dto: UserCreateDTO
}
export interface LoginUserQuery {
  dto: UserLoginDTO
}

export interface CheckEmailQuery {
  dto: CheckEmailDTO
}

export interface CheckUsernameQuery {
  dto: CheckUsernameDTO
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username: string
    email: string
    isVerified: boolean
  }
}

export interface VerifyTokenResponse {
  user: {
    id: string
    email: string
  }
}
