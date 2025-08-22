import { Router } from 'express'
import { UserProfileController } from './interfaces/http/controllers'
import { UserProfileGrpcController } from './interfaces/grpc/controllers'
import { UserProfileGrpcServer } from './infra/grpc/server'
import { createAuthMiddleware } from '~/share/middleware/auth'
import { multerUploadMiddleware } from '~/share/middleware/multerUpload'

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

  const controller = new UserProfileController(
    usecases.createProfile,
    usecases.getUser,
    usecases.updateProfileUser
  )

  const authMiddleware = createAuthMiddleware(infra.jwtService)

  const router = Router()
  router.get('/profile/:userId', controller.getAPI.bind(controller))
  router.post('/profile', authMiddleware, controller.createAPI.bind(controller))
  router.patch(
    '/profile',
    authMiddleware,
    multerUploadMiddleware.upload.fields([
      { name: 'avatarUrl', maxCount: 1 },
      { name: 'headerImageUrl', maxCount: 1 },
    ]),
    multerUploadMiddleware.parseFormData,
    controller.updateAPI.bind(controller)
  )
  return router
}
