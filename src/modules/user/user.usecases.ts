import { CreateUserProfileCmdHandler } from './use-cases';
import { GetUserProfileQueryHandler } from './use-cases/get';

export function buildUserUseCases(
  infra: ReturnType<typeof import('./user.infras').buildUserInfrastructure>
) {
  return {
    createProfile: new CreateUserProfileCmdHandler(infra.repository),
    getUser: new GetUserProfileQueryHandler(infra.repository, infra.authGrpcClient),
  }
}
