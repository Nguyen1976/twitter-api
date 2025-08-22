import { IQueryHandler } from '~/share/interface'
import { GetUserProfileQuery } from '../interfaces/userProfileQueries'
import { UserProfile } from '../interfaces/dtos'
import { GetUserResponse, IAuthService } from '~/share/interface/grpc/auth'
import { IUserProfileRepository } from '../interfaces/userProfileRepository'

export class GetUserProfileQueryHandler
  implements IQueryHandler<GetUserProfileQuery, GetUserResponse & UserProfile>
{
  constructor(
    private readonly repository: IUserProfileRepository,
    private readonly authServiceGrpc: IAuthService
  ) {}

  async query(
    query: GetUserProfileQuery
  ): Promise<GetUserResponse & UserProfile> {
    const { userId } = query.dto
    const userProfile = await this.repository.findByCond({ userId }) //dữ liệu từ userProfile
    console.log("🚀 ~ userProfile:", userProfile)

    const authUser = await this.authServiceGrpc.getUser({ userId })
    return {
      ...authUser,
      ...userProfile,
    } as GetUserResponse & UserProfile
  }
}
