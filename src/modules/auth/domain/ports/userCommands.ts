import {
  SendVerificationOtpDTO,
  UserCreateDTO,
  VerifyOtpDTO,
} from '../domain/dtos/dto'

export interface CreateCommand {
  dto: UserCreateDTO
}

export interface SendVerificationOtpCommand {
  dto: SendVerificationOtpDTO
}

export interface VerifyOtpCommand {
  dto: VerifyOtpDTO
}
