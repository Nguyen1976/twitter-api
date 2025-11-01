import { CreateFollowUseCase } from './use-cases/CreateFollow'

export function buildFollowUseCases(
  infra: ReturnType<typeof import('./follow.infras').buildFollowInfrastructure>
) {
  return {
    createFollow: new CreateFollowUseCase(infra.followMongoDBRepository),
  }
}
