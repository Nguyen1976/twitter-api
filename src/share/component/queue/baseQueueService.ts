// BaseQueueService.ts
import { Queue, Worker, Job, QueueOptions, WorkerOptions } from 'bullmq'
import { Redis } from 'ioredis'

export abstract class BaseQueueService<T> {
  protected queue: Queue<T>
  protected worker?: Worker<T>

  constructor(
    queueName: string,
    protected redis: Redis,
    queueOptions?: QueueOptions,
    workerOptions?: WorkerOptions
  ) {
    this.queue = new Queue<T>(queueName, {
      connection: this.redis,
      ...queueOptions,
    })

    this.worker = new Worker<T>(
      queueName,
      async (job: Job<T>) => this.process(job),
      {
        connection: this.redis,
        concurrency: 1,
        ...workerOptions,
      }
    )

    this.setupEventHandlers()
  }

  // Phương thức bắt buộc phải implement
  protected abstract process(job: Job<T>): Promise<any>

  protected setupEventHandlers() {
    this.worker?.on('completed', (job) => {
      console.log(
        `[✔️ Completed] Job ${job.id} for ${JSON.stringify(job.data)}`
      )
    })

    this.worker?.on('failed', (job, err) => {
      console.error(`[❌ Failed] Job ${job?.id}:`, err.message)
    })

    this.worker?.on('error', (err) => {
      console.error(`[🔥 Error] Worker error:`, err)
    })
  }

  async close(): Promise<void> {
    if (this.worker) await this.worker.close()
    if (this.queue) await this.queue.close()
  }
}
