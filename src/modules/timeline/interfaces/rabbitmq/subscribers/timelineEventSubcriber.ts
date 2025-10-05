import { RabbitMQConnection } from '~/share/component/rabbitmq/connection'
import { ITweetCreatedEvent } from '~/modules/tweet/infra/rabbitmq/publishers/tweetEventPublisher'
import { ICommandHandler } from '~/share/interface'
import { ITimeLineCommand } from '../../TimeLineCommand'
import { Channel } from 'amqplib'

export class TimelineEventSubscriber {
  constructor(
    private readonly updateTimeline: ICommandHandler<ITimeLineCommand, void>,
    private readonly channel: Channel
  ) {}

  async subscribeTweetEvents(): Promise<void> {
    try {
      await this.channel.consume(
        'timeline.tweet.created',

        async (msg) => {
          if (!msg) return

          try {
            const event: ITweetCreatedEvent = JSON.parse(msg.content.toString())
            console.log('Received tweet.created event:', event)

            await this.updateTimeline.execute({
              dto: {
                tweetId: event.tweetId,
                userId: event.userId,
              },
            })

            this.channel.ack(msg)
          } catch (error) {
            this.channel.nack(msg, false, false)
            console.error('Error processing tweet.created event:', error)
          }
        },
        { noAck: false } // đảm bảo message được ack
      )
    } catch (error) {
      console.log('Timeline service subscribed to tweet events')
      throw error
    }
  }
}
