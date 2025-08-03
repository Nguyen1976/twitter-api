import { CheckEmailDTO, CheckUsernameDTO, UserLoginDTO } from "./dtos/dto"


export interface LoginUserQuery {
  dto: UserLoginDTO
}

export interface CheckEmailQuery {
  dto: CheckEmailDTO
}

export interface CheckUsernameQuery {
  dto: CheckUsernameDTO
}
