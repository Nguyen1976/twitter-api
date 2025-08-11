import { CreateUserProfileCmdHandler } from './use-cases';

export function buildUserUseCases(
  infra: ReturnType<typeof import('./user.infras').buildUserInfrastructure>
) {
  return {
    createProfile: new CreateUserProfileCmdHandler(infra.repository),
  }
}
