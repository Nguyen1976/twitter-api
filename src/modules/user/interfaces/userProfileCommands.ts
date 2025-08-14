import { UserProfileCreateDTO, UserProfileUpdateDTO } from "./dtos";

export interface CreateCommand {
  dto: UserProfileCreateDTO
}

export interface UpdateCommand {
  dto: UserProfileUpdateDTO
}