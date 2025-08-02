import { Queue, Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { IEmailService, IOtpJobData, IOtpQueueService, IOtpService } from '~/share/interface'



export class OtpQueueService implements IOtpQueueService {
  private otpQueue: Queue<IOtpJobData>
  private worker: Worker<IOtpJobData> | undefined

  constructor(
    private redis: Redis, // Nhận Redis instance từ ngoài
    private otpService: IOtpService,
    private emailService: IEmailService
  ) {
    // Tạo queue với Redis instance được truyền vào
    this.otpQueue = new Queue<IOtpJobData>('otp-queue', {
      connection: this.redis, 
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        }
      }
    })

    this.createWorker()
  }

  //Tạo worker để xử lý các job trong queue
  private createWorker(): void {
    this.worker = new Worker<IOtpJobData>(
      'otp-queue',
      this.processOtpJob.bind(this),
      {
        connection: this.redis, // Dùng Redis instance được truyền vào
        concurrency: 1, //Chỉ sử lý 1 job tại 1 thời điểm
      }
    )

    //Kiểm tra các sự kiện của worker
    this.worker.on('completed', (job) => {
      console.log(`OTP job ${job.id} completed for: ${job.data.email}`)
    })

    this.worker.on('failed', (job, err) => {
      console.error(`OTP job ${job?.id} failed for: ${job?.data.email}`, err.message)
    })

    this.worker.on('error', (err) => {
      console.error(`OTP worker error:`, err)
    })

    console.log('OTP Queue Worker started')
  }

  // Xử lý job OTP
  private async processOtpJob(job: Job<IOtpJobData>): Promise<boolean> {
    const { email, username } = job.data
    
    try {
      console.log(`🔐 Processing OTP for: ${email}`)
      
      // 1. Generate OTP
      const { otp, createdAt } = await this.otpService.generate(email)
      
      // 2. Send OTP email
      const emailSent = await this.emailService.sendOtpEmail(email, otp)
      
      if (!emailSent) {
        // Remove OTP if email failed
        await this.otpService.validate(email, otp)
        throw new Error('Không thể gửi email xác thực. Vui lòng thử lại.')
      }
      
      console.log(`OTP processed successfully for: ${email}`)
      return true
      
    } catch (error) {
      console.error(`OTP processing failed for ${email}:`, error)
      throw error
    }
  }

  async sendOtpEmail(email: string, username: string): Promise<void> {
    await this.otpQueue.add(
      'send-otp',
      { email, username },
      {
        priority: 1, // High priority
        attempts: 3,
        delay: 0, // Send immediately
      }
    )
    
    console.log(`🔐 OTP job queued for: ${email}`)
  }

  //Lấy thông tin, trạng thái về queue
  async getStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.otpQueue.getWaiting(),
      this.otpQueue.getActive(),
      this.otpQueue.getCompleted(),
      this.otpQueue.getFailed()
    ])

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + active.length + completed.length + failed.length
    }
  }

  // Đóng worker một cách an toàn
  async close(): Promise<void> {
    if (this.worker) {
      await this.worker.close()
      console.log('OTP Worker closed')
    }
    
    if (this.otpQueue) {
      await this.otpQueue.close()
      console.log('OTP Queue closed')
    }
  }
}

//Tạo một instance duy nhất của OtpQueueService
let otpQueueServiceInstance: OtpQueueService | null = null

export const createOtpQueueService = (
  redis: Redis, // Nhận Redis instance
  otpService: IOtpService, 
  emailService: IEmailService
): OtpQueueService => {
  if (!otpQueueServiceInstance) {
    otpQueueServiceInstance = new OtpQueueService(redis, otpService, emailService)
  }
  return otpQueueServiceInstance
}

export const getOtpQueueService = (): OtpQueueService => {
  if (!otpQueueServiceInstance) {
    throw new Error('OTP Queue Service not initialized. Call createOtpQueueService first.')
  }
  return otpQueueServiceInstance
}

// Cleanup function
export const closeOtpQueue = async (): Promise<void> => {
  if (otpQueueServiceInstance) {
    await otpQueueServiceInstance.close()
    otpQueueServiceInstance = null
  }
  console.log('OTP Queue system closed')
}