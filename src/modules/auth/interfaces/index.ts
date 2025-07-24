import { IRepository } from '~/share/interface'
import {
  UserCondDTO,
  UserCreateDTO,
  UserLoginDTO,
  UserUpdateDTO,
} from './dtos/dto'
import { User } from '../domain/entities/user'

// export interface IUserUseCase {
//   create(data: UserCreateDTO): Promise<string>
// }

export interface IUserRepository
  extends IRepository<User, UserCondDTO, UserUpdateDTO> {
  isUsernameOrEmailTaken(username: string, email: string): Promise<boolean>
  findByUsername(username: string): Promise<User | null>
}

export interface CreateCommand {
  dto: UserCreateDTO
}

export interface LoginUserQuery {
  dto: UserLoginDTO
}

export interface UpdateCommand {
  id: string
  dto: UserUpdateDTO
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    isVerified: boolean
  }
}

export interface VerifyTokenQuery {
  dto: { token: string }
}

export interface VerifyTokenResponse {
  user: {
    id: string
    email: string
  }
}