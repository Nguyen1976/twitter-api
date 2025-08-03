import { SendVerificationOtpDTO, UserCreateDTO } from "./dtos/dto"


export interface CreateCommand {
  dto: UserCreateDTO
}

export interface SendVerificationOtpCommand {
  dto: SendVerificationOtpDTO
}
