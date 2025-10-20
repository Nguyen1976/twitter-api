import { RabbitMQConnection } from '~/share/component/rabbitmq/connection'
import * as amqp from 'amqplib'

export interface ITweetCreatedEvent {
  tweetId: string
  userId: string
}

export class TweetEventPublisher {
  constructor(private readonly channel: amqp.Channel) {}

  async publishTweetCreated(event: ITweetCreatedEvent): Promise<void> {
    try {
      const message = Buffer.from(JSON.stringify(event))

      const published = this.channel.publish(
        'tweet.events', // exchange
        'tweet.created', // routing key
        message,
        { persistent: true, timestamp: Date.now(), messageId: event.tweetId } // make message persistent
      )

      if (published) {
        console.log('Published tweet.created event:', event)
      } else {
        throw new Error('Failed to publish tweet.created event')
      }
    } catch (error) {
      console.error('Error publishing tweet.created event:', error)
      throw error
    }
  }
}
