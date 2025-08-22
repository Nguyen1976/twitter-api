import { ICloudinaryService, ICommandHandler } from '~/share/interface'
import { UpdateCommand } from '../interfaces/userProfileCommands'
import { IUserProfileRepository } from '../interfaces/userProfileRepository'
import { v7 } from 'uuid'
import { UserProfile } from '../interfaces/dtos'

export class UpdateUserProfileCmdHandler
  implements ICommandHandler<UpdateCommand, boolean>
{
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly updateUserImagesQueue: any
  ) {}
  async execute(command: UpdateCommand): Promise<boolean> {
    const {
      dto: { userId, avatarUrl, headerImageUrl, ...updateData },
    } = command
    const existingProfile = await this.userProfileRepository.findByCond({
      userId,
    })

    if (!existingProfile) {
      throw new Error('User profile not found')
    }

    this.updateUserImagesQueue.uploadImage({
      id: existingProfile?.id,
      userId: userId,
      avatarFile: avatarUrl,
      avatarFolder: 'users/avatar-image',
      headerFile: headerImageUrl,
      headerFolder: 'users/header-image',
      oldUrlAvatar: existingProfile?.avatarUrl,
      oldUrlHeader: existingProfile?.headerImageUrl,
    })

    //tạm thời trong dto vẫn là avatarUrl và headerImageUrl thực tế là sẽ nhận vào formData từ fe sau đó upload image lên cloudinary và nhận về cdn rồi lưu vào db
    await this.userProfileRepository.update(existingProfile?.id, {
      ...updateData,
      userId,
    })
    return true
  }
}
/**
 * users/avatar-image
 * users/header-image
 */
