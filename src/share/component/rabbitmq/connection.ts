import * as amqp from 'amqplib'
import type { Connection, Channel } from 'amqplib' 
import { config } from '../config'

export class RabbitMQConnection {
  private static connection: any | null = null
//   private static connection: Connection | null = null bị lõi về type lên sẽ tạm thời để any

  private static channel: Channel | null = null

  static async connect(): Promise<void> {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(
          config.rabbitmq.url || 'amqp://localhost'
        )
        console.log('Connected to RabbitMQ')
      }

      if (!this.channel) {
        this.channel = await this.connection.createChannel()
        console.log('Created RabbitMQ channel')
      }

      await this.setupExchangesAndQueues()
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error)
      throw error
    }
  }

  private static async setupExchangesAndQueues(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized')

    // Tạo hoặc xác nhận exchange tweet.events dạng topic bền
    //exchange hiểu là chỗ publish sự kiện
    await this.channel.assertExchange('tweet.events', 'topic', {
      durable: true,
    })

    // Tạo hoặc xác nhận queue timeline.tweet.created bền để nhận sự kiện tweet.created
    await this.channel.assertQueue('timeline.tweet.created', { durable: true })

    // Gắn queue vào exchange với routing key tweet.created hiểu là chạy khi có sự kiện tweet.created
    await this.channel.bindQueue(
      'timeline.tweet.created',
      'tweet.events',
      'tweet.created'
    )

    console.log('✅ RabbitMQ exchanges and queues setup complete')
  }

  static getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error('Channel not initialized. Call connect() first.')
    }
    return this.channel
  }

  static async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close()
        this.channel = null
      }
      if (this.connection) {
        await this.connection.close()
        this.connection = null
      }
      console.log('✅ RabbitMQ disconnected')
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error)
    }
  }
}

/**
 * Kiến thức về rabbitmq
 * * 1. Exchange: Nơi nhận và phân phối tin nhắn đến các hàng đợi (queues) dựa trên các quy tắc định tuyến (routing rules).
 * * 2. Queue: Nơi lưu trữ tin nhắn cho đến khi chúng được xử lý bởi một consumer.
 * * 3. Binding: Mối liên kết giữa một exchange và một queue, xác định cách thức tin nhắn được định tuyến đến queue.
 *
 *
 *
 * 1. Exchange: "tweet.events" là một exchange dạng topic bền. Điều này có nghĩa là nó sẽ tồn tại ngay cả khi RabbitMQ khởi động lại và nó có thể định tuyến tin nhắn dựa trên các mẫu routing key.
 * 2. Queue: "timeline.tweet.created" là một queue bền, nơi các tin nhắn sẽ được lưu trữ cho đến khi chúng được xử lý.
 * 3. Binding: Queue "timeline.tweet.created" được liên kết với exchange "tweet.events" bằng routing key "tweet.created". Điều này có nghĩa là bất kỳ tin nhắn nào được gửi đến exchange với routing key "tweet.created" sẽ được định tuyến đến queue này.
 *
 *  với dạng topic có thể sử dụng các ký tự đại diện như * (một từ) và # (nhiều từ) trong routing key để tạo các quy tắc định tuyến linh hoạt hơn.
 * ví dụ tweet.* sẽ khớp với tweet.created, tweet.deleted, v.v.
 * tweet.# sẽ khớp với tweet.created, tweet.updated.status, tweet.deleted.permanently, v.v.
 *
 * ngoài topic còn có những kiểu khác như direct, fanout, headers
 * direct: routing key phải khớp chính xác
 * fanout: gửi tin nhắn đến tất cả các queue được liên kết với exchange mà không quan tâm đến routing key
 * headers: sử dụng các thuộc tính trong header của tin nhắn để định tuyến thay vì routing key
 *
 * * durable: true đảm bảo rằng exchange và queue sẽ tồn tại ngay cả khi RabbitMQ khởi động lại.
 */
