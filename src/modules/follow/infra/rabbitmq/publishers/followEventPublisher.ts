import { RabbitMQConnection } from '~/share/component/rabbitmq/connection'
import * as amqp from 'amqplib'
import { IFollowCreatedEvent } from '~/share/interface/rabbitmq'



export class FollowEventPublisher {
  constructor(private readonly channel: amqp.Channel) {}

  async publishFollowCreated(event: IFollowCreatedEvent): Promise<void> {
    try {
      const message = Buffer.from(JSON.stringify(event))

      const published = this.channel.publish(
        'follow.events', // exchange
        'follow.created', // routing key
        message,
        { persistent: true, timestamp: Date.now(), messageId: event.followerId } // make message persistent
      )

      if (published) {
        console.log('Published follow.created event:', event)
      } else {
        throw new Error('Failed to publish follow.created event')
      }
    } catch (error) {
      console.error('Error publishing follow.created event:', error)
      throw error
    }
  }
}
