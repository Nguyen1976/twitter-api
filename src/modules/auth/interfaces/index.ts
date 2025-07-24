import { IRepository } from '~/share/interface'
import { UserCondDTO, UserCreateDTO, UserUpdateDTO } from './dtos/dto'
import { User } from '../domain/entities/user'

// export interface IUserUseCase {
//   create(data: UserCreateDTO): Promise<string>
// }

export interface IUserRepository extends IRepository<User, UserCondDTO, UserUpdateDTO> {
  isUsernameOrEmailTaken(username: string, email: string): Promise<boolean>
}

export interface CreateCommand {
  dto: UserCreateDTO
}

export interface GetDetailQuery {
  id: string
}

export interface UpdateCommand {
  id: string
  dto: UserUpdateDTO
}

export interface DeleteCommand {
  id: string
  isHard: boolean
}
