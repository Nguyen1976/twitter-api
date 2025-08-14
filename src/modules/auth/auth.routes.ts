import { Router } from 'express'
import { AuthController } from './interfaces/http/controllers'
import { AuthGrpcController } from './interfaces/grpc/controller'
import { AuthGrpcServer } from './infra/grpc/server'

export function buildAuthRouter(usecases: ReturnType<typeof import('./auth.usecases').buildAuthUseCases>) {
  const controller = new AuthController(
    usecases.userUsecase,
    usecases.userLoginUsecase,
    usecases.refreshTokenCmdHandler,
    usecases.sendVerificationOtpCmdHandler,
    usecases.verifyOtpCmdHandler
  )

  //grpc
  const grpcController = new AuthGrpcController(
    usecases.getUser
  )
  new AuthGrpcServer(grpcController).start(50052)
  
  //end: grpc

  const router = Router()

  router.post('/register', controller.createAPI.bind(controller))
  router.post('/login', controller.loginAPI.bind(controller))
  router.post('/refresh-token', controller.refreshTokenAPI.bind(controller))
  router.post('/send-verification', controller.sendVerificationAPI.bind(controller))
  router.post('/verify-otp', controller.verifyOtpAPI.bind(controller))
  router.delete('/logout', controller.logoutAPI.bind(controller))

  return router
}
