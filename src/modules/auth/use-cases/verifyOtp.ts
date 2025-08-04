import { ICommandHandler, IOtpService } from '~/share/interface'

import { VerifyOtpCommand } from '../interfaces/userCommands'
import { IUserRepository } from '../interfaces/userRepository'
// ✅ Verify OTP Use Case
export class VerifyOtpCmdHandler
  implements ICommandHandler<VerifyOtpCommand, boolean>
{
  constructor(
    private readonly otpService: IOtpService
  ) {}

  async execute(command: VerifyOtpCommand): Promise<boolean> {
    //không cần check email vì email chưa tồn tại và bản chất email dc lưu trong redis kèm otp rồi
    // Check if OTP is valid
    const isValidOtp = await this.otpService.validate(
      command.dto.email,
      command.dto.otp
    )
    if (!isValidOtp) {
      return false
    }

    return true
  }
}

//luồng:
/**
 * Tạo otp và lưu vào redis với otp:email : secret
 * khi người dùng check thì sẽ gửi otp lên và và email và mình sẽ tìm sercet dựa vào email sau đó check otp có chuẩn với sercet không
 */
