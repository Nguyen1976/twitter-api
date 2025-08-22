import {
  CreateUserProfileCmdHandler,
  UpdateUserProfileCmdHandler,
} from './use-cases'
import { GetUserProfileQueryHandler } from './use-cases/getUserProfile'

export function buildUserUseCases(
  infra: ReturnType<typeof import('./user.infras').buildUserInfrastructure>
) {
  return {
    createProfile: new CreateUserProfileCmdHandler(infra.repository),
    getUser: new GetUserProfileQueryHandler(
      infra.repository,
      infra.authGrpcClient
    ),
    updateProfileUser: new UpdateUserProfileCmdHandler(
      infra.repository,
      infra.updateUserImagesQueue
    ),
  }
}
