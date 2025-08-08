import { IRepository } from "~/share/interface";
import { UserProfile, UserProfileCondDTO, UserProfileUpdateDTO } from "./dtos";

export interface IUserProfileRepository
  extends IRepository<UserProfile, UserProfileCondDTO, UserProfileUpdateDTO> {}
