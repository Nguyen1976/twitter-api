import { Router } from 'express'
import { AuthController } from './interfaces/controllers'

export function buildAuthRouter(usecases: ReturnType<typeof import('./auth.usecases').buildAuthUseCases>) {
  const controller = new AuthController(
    usecases.userUsecase,
    usecases.userLoginUsecase,
    usecases.refreshTokenCmdHandler,
    usecases.checkEmailQueryHandler,
    usecases.checkUsernameQueryHandler,
    usecases.sendVerificationOtpCmdHandler,
    usecases.verifyOtpCmdHandler
  )

  const router = Router()
  router.post('/register', controller.createAPI.bind(controller))
  router.post('/login', controller.loginAPI.bind(controller))
  router.post('/refresh-token', controller.refreshTokenAPI.bind(controller))
  router.post('/check-email', controller.checkEmailAPI.bind(controller))
  router.post('/check-username', controller.checkUsernameAPI.bind(controller))
  router.post('/send-verification', controller.sendVerificationAPI.bind(controller))
  router.post('/verify-otp', controller.verifyOtpAPI.bind(controller))
  return router
}
