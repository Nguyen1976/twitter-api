import { Router } from 'express'
import { UserProfileController } from './interfaces/http/controllers'
import { UserProfileGrpcController } from './interfaces/grpc/controllers'
import { UserProfileGrpcServer } from './infra/grpc/server'
import { createAuthMiddleware } from '~/share/middleware/auth'

export function buildUserRouter(
  usecases: ReturnType<typeof import('./user.usecases').buildUserUseCases>,
  infra: ReturnType<typeof import('./user.infras').buildUserInfrastructure>
) {
  // gRPC
  const userProfileControllerGrpc = new UserProfileGrpcController(
    usecases.createProfile
  )

  new UserProfileGrpcServer(userProfileControllerGrpc).start(50051)
  // end: gRPC

  const controller = new UserProfileController(usecases.createProfile, usecases.getUser)

  const authMiddleware = createAuthMiddleware(infra.jwtService)

  const router = Router()
  router.get('/profile', authMiddleware, controller.getAPI.bind(controller))
  router.post('/profile', authMiddleware, controller.createAPI.bind(controller))
  return router
}
