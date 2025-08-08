import { ICommandHandler } from '~/share/interface'
import { CreateCommand } from '../interfaces/userProfileCommands'
import { IUserProfileRepository } from '../interfaces/userProfileRepository'
import { v7 } from 'uuid'
import { UserProfile } from '../interfaces/dtos'

export class CreateUserProfileCmdHandler
  implements ICommandHandler<CreateCommand, string>
{
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}
  async execute(command: CreateCommand): Promise<string> {
    const { dto } = command
    const newUserProfile: UserProfile = {
      id: v7(),
      userId: dto.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      followerCount: 0,
      followingCount: 0,
    }
    await this.userProfileRepository.insert(newUserProfile)
    return newUserProfile.id
  }
}
