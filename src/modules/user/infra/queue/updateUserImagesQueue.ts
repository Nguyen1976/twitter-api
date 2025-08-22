//job queue này thực hiện việc upload ảnh của việc update user dưới nền

import { Job } from 'bullmq'
import { ICloudinaryService } from '~/share/interface'
import Redis from 'ioredis'
import { BaseQueueService } from '~/share/component/queue/baseQueueService'
import { IUserProfileRepository } from '../../interfaces'

export interface IUpdateUserImagesJobData {
  id: string //đây là id của bảng userProfile
  userId: string //đây là id của bảng user

  avatarFile?: Express.Multer.File
  avatarFolder?: string

  headerFile?: Express.Multer.File
  headerFolder?: string

  oldUrlAvatar?: string
  oldUrlHeader?: string
}

export class UploadImageQueueService extends BaseQueueService<IUpdateUserImagesJobData> {
  constructor(
    redis: Redis,
    private readonly cloudinaryService: ICloudinaryService,
    private readonly userProfileRepository: IUserProfileRepository
  ) {
    super('upload-image-queue', redis, {
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
      connection: redis,
    })
  }

  protected async process(
    job: Job<IUpdateUserImagesJobData>
  ): Promise<boolean> {
    try {
      const {
        id,
        userId,
        avatarFile,
        avatarFolder,
        headerFile,
        headerFolder,
        oldUrlAvatar,
        oldUrlHeader,
      } = job.data

      let avatarUrl: string | undefined
      let headerImageUrl: string | undefined

      if (avatarFile && avatarFolder) {
        avatarUrl = await this.cloudinaryService.uploadImage(
          avatarFile,
          avatarFolder
        )
        if (oldUrlAvatar) {
          await this.cloudinaryService.deleteImage(oldUrlAvatar)
        }
      }
      if (headerFile && headerFolder) {
        headerImageUrl = await this.cloudinaryService.uploadImage(
          headerFile,
          headerFolder
        )
        if (oldUrlHeader) {
          await this.cloudinaryService.deleteImage(oldUrlHeader)
        }
      }

      this.userProfileRepository.update(id, {
        avatarUrl,
        headerImageUrl,
        userId, //trường userId vẫn phải bắt buộc vì baseRepo nó dựa vào dto update của userId mà ngay từ đầu nó đã bắt buộc phải có khi gửi lên từ fe
      })

      return true
    } catch (error) {
      throw error // Re-throw to let Bull handle retries
    }
  }

  async uploadImage({
    id,
    userId,
    avatarFile,
    avatarFolder,
    headerFile,
    headerFolder,
    oldUrlAvatar,
    oldUrlHeader,
  }: IUpdateUserImagesJobData): Promise<void> {
    await this.queue.add(
      'upload-image',
      {
        id,
        userId,
        avatarFile,
        avatarFolder,
        headerFile,
        headerFolder,
        oldUrlAvatar,
        oldUrlHeader,
      },
      { priority: 1 }
    )
  }
}
