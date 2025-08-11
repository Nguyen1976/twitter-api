import { Router } from 'express'
import { UserProfileController } from './interfaces/http/controllers'
import { UserProfileGrpcController } from './interfaces/grpc/controllers'
import { UserProfileGrpcServer } from './infra/grpc/server'

export function buildUserRouter(
  usecases: ReturnType<typeof import('./user.usecases').buildUserUseCases>
) {
  // gRPC
  const userProfileControllerGrpc = new UserProfileGrpcController(
    usecases.createProfile
  )

  new UserProfileGrpcServer(userProfileControllerGrpc).start(50051)
  // end: gRPC

  const controller = new UserProfileController(usecases.createProfile)

  const router = Router()
  router.post('/profile', controller.createAPI.bind(controller))
  return router
}
