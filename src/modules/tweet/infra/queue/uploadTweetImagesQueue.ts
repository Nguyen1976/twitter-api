//job queue này thực hiện việc upload ảnh của việc update user dưới nền

import { Job } from 'bullmq'
import { ICloudinaryService } from '~/share/interface'
import Redis from 'ioredis'
import { BaseQueueService } from '~/share/component/queue/baseQueueService'
import { ITweetRepository } from '../../interfaces/tweetRepository'

export interface IUploadTweetImagesJobData {
  id: string
  images: Express.Multer.File[]
}

export class UploadImageQueueService extends BaseQueueService<IUploadTweetImagesJobData> {
  constructor(
    redis: Redis,
    private readonly cloudinaryService: ICloudinaryService,
    private readonly tweetRepository: ITweetRepository
  ) {
    super('upload-image-on-tweet-queue', redis, {
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
    job: Job<IUploadTweetImagesJobData>
  ): Promise<boolean> {
    try {
      const { id, images } = job.data
      let urls = ''

      //call cloudinary
      for (let i = 0; i < images.length; i++) {
        let url = await this.cloudinaryService.uploadImage(
          images[i],
          'tweet-images'
        )
        urls += `${url},`
      }

      //format url bỏ dấu phẩy ở cuối
      urls = urls
        .split(',')
        .filter((e) => e)
        .join(',')

      //update on db
      this.tweetRepository.update(id, {
        mediaUrl: urls,
      })

      return true
    } catch (error) {
      throw error // Re-throw to let Bull handle retries
    }
  }

  async uploadImage({ id, images }: IUploadTweetImagesJobData): Promise<void> {
    await this.queue.add(
      'upload-image-on-tweet',
      { id, images },
      { priority: 1 }
    )
  }
}
