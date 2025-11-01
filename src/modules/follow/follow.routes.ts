import { Router } from 'express'
import { FollowController } from './infra/http/controllers'

export function buildFollowRouter(
  usecases: ReturnType<typeof import('./follow.usecases').buildFollowUseCases>
) {
  const controller = new FollowController(usecases.createFollow)
  const router = Router()

  router.post('/', controller.createFollowAPI.bind(controller))

  return router
}
