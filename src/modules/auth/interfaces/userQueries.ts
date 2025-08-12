import { CheckEmailDTO, CheckUsernameDTO, GetUserDTO, UserLoginDTO } from "./dtos/dto"


export interface LoginUserQuery {
  dto: UserLoginDTO
}

export interface CheckEmailQuery {
  dto: CheckEmailDTO
}

export interface CheckUsernameQuery {
  dto: CheckUsernameDTO
}

export interface GetUserQuery {
  dto: GetUserDTO
}