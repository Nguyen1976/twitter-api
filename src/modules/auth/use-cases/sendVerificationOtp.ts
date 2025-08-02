import {
  ICommandHandler,
  IEmailService,
  IOtpQueueService,
  IOtpService,
} from '~/share/interface'
import {
  IUserRepository,
  SendVerificationOtpCommand,
  SendVerificationOtpResponse,
} from '../interfaces'
import { UserAlreadyExistsError } from '../domain/errors/user-errors'
// ✅ Send Verification OTP Use Case
export class SendVerificationOtpCmdHandler
  implements
    ICommandHandler<SendVerificationOtpCommand, SendVerificationOtpResponse>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpQueueService: IOtpQueueService
  ) {}

  async execute(
    command: SendVerificationOtpCommand
  ): Promise<SendVerificationOtpResponse> {
    // 1. Check if email/username already exists
    const existingUser = await this.userRepository.findByCond({
      username: command.dto.username,
      email: command.dto.email,
    })

    if (existingUser) {
      throw new UserAlreadyExistsError('Username hoặc email đã được sử dụng')
    }

    await this.otpQueueService.sendOtpEmail(
      command.dto.email,
      command.dto.username
    )

    return {
      message:
        'Mã OTP đang được xử lý và sẽ được gửi đến email của bạn trong giây lát',
      expiresIn: 60,
      createdAt: new Date().getTime(),
    }
  }
}

//luồng:
/**
 * Tạo otp và lưu vào redis với otp:email : secret
 * khi người dùng check thì sẽ gửi otp lên và và email và mình sẽ tìm sercet dựa vào email sau đó check otp có chuẩn với sercet không
 */
