import { ICommandHandler, IEmailService, IOtpService } from '~/share/interface'
import { IUserRepository, SendVerificationOtpCommand, SendVerificationOtpResponse } from '../interfaces'
import { UserAlreadyExistsError } from '../domain/errors/user-errors'

// ✅ Send Verification OTP Use Case
export class SendVerificationOtpCmdHandler implements ICommandHandler<SendVerificationOtpCommand, SendVerificationOtpResponse> {
  constructor(
    private readonly otpService: IOtpService,
    private readonly emailService: IEmailService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: SendVerificationOtpCommand): Promise<SendVerificationOtpResponse> {
    // 1. Check if email/username already exists
    const existingUser = await this.userRepository.findByCond({
      username: command.dto.username,
      email: command.dto.email
    })

    if (existingUser) {
      throw new UserAlreadyExistsError('Username hoặc email đã được sử dụng')
    }

    // 2. Generate OTP
    const { otp, createdAt } = await this.otpService.generate(command.dto.email)


    // 3. Send OTP email
    const emailSent = await this.emailService.sendOtpEmail(command.dto.email, otp)

    if (!emailSent) {
      // Remove OTP if email failed
      await this.otpService.validate(command.dto.email, otp)//nếu email gửi k thành công thì validate tức là tự xóa otp
      throw new Error('Không thể gửi email xác thực. Vui lòng thử lại.')
    }

    return {
      message: 'Mã OTP đã được gửi đến email của bạn',
      expiresIn: 60,
      createdAt
    }
  }
}

//luồng:
/**
 * Tạo otp và lưu vào redis với otp:email : secret
 * khi người dùng check thì sẽ gửi otp lên và và email và mình sẽ tìm sercet dựa vào email sau đó check otp có chuẩn với sercet không
 */