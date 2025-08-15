import { ICommandHandler } from '~/share/interface'
import { UpdateCommand } from '../interfaces/userProfileCommands'
import { IUserProfileRepository } from '../interfaces/userProfileRepository'
import { v7 } from 'uuid'
import { UserProfile } from '../interfaces/dtos'

export class UpdateUserProfileCmdHandler
  implements ICommandHandler<UpdateCommand, boolean>
{
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}
  async execute(command: UpdateCommand): Promise<boolean> {
    const { dto } = command
    const existingProfile = await this.userProfileRepository.findByCond({
      userId: dto.userId,
    })
    if (!existingProfile) {
      throw new Error('User profile not found')
    }
    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...dto,
      updatedAt: new Date(),
    }
    await this.userProfileRepository.update(existingProfile.id, updatedProfile) //update theo id
    return true
  }
}
