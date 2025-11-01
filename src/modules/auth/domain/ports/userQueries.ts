import { GetUserDTO, UserLoginDTO } from '../domain/dtos/dto'

export interface LoginUserQuery {
  dto: UserLoginDTO
}

export interface GetUserQuery {
  dto: GetUserDTO
}
