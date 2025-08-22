import { Job } from 'bullmq'
import { IOtpJobData, IOtpService, IEmailService } from '~/share/interface'
import Redis from 'ioredis'
import { BaseQueueService } from './baseQueueService'

export class OtpQueueService extends BaseQueueService<IOtpJobData> {
  constructor(
    redis: Redis,
    private otpService: IOtpService,
    private emailService: IEmailService
  ) {
    super('otp-queue', redis, {
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
      connection: redis
    })
  }

  protected async process(job: Job<IOtpJobData>): Promise<boolean> {
    const { email, username } = job.data

    const { otp } = await this.otpService.generate(email)
    const emailSent = await this.emailService.sendOtpEmail(email, otp)

    if (!emailSent) {
      await this.otpService.validate(email, otp)
      throw new Error('Không thể gửi email xác thực.')
    }

    return true
  }

  async sendOtpEmail(email: string, username: string): Promise<void> {
    await this.queue.add('send-otp', { email, username }, { priority: 1 })
  }
}
