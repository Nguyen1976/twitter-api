import { CheckEmailQueryHandler, CheckUsernameQueryHandler, CreateNewUserCmdHandler, LoginUserQueryHandler, RefreshTokenCmdHandler, SendVerificationOtpCmdHandler, VerifyOtpCmdHandler } from './use-cases';



export function buildAuthUseCases(infra: ReturnType<typeof import('./auth.infras').buildAuthInfrastructure>) {
  return {
    userUsecase: new CreateNewUserCmdHandler(
      infra.repository,
      infra.passwordHashService,
      infra.emailService,
      infra.userProfileGrpcClient
    ),
    userLoginUsecase: new LoginUserQueryHandler(
      infra.repository,
      infra.passwordHashService,
      infra.jwtService
    ),
    refreshTokenCmdHandler: new RefreshTokenCmdHandler(
      infra.jwtService,
      infra.repository
    ),
    checkEmailQueryHandler: new CheckEmailQueryHandler(infra.repository),
    checkUsernameQueryHandler: new CheckUsernameQueryHandler(infra.repository),
    sendVerificationOtpCmdHandler: new SendVerificationOtpCmdHandler(
      infra.repository,
      infra.otpQueueService
    ),
    verifyOtpCmdHandler: new VerifyOtpCmdHandler(infra.otpService),
  }
}
