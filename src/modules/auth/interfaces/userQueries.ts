import { GetUserDTO, UserLoginDTO } from "./dtos/dto"


export interface LoginUserQuery {
  dto: UserLoginDTO
}

export interface GetUserQuery {
  dto: GetUserDTO
}