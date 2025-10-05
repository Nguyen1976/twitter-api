import { RabbitMQConnection } from '~/share/component/rabbitmq/connection'
import { ITweetCreatedEvent } from '~/share/component/rabbitmq/publishers/tweetEventPublisher'
import { ICommandHandler } from '~/share/interface'
import { ITimeLineCommand } from '../../TimeLineCommand'

export class TimelineEventSubscriber {
  private channel = RabbitMQConnection.getChannel()

  constructor(
    private updateTimeline: ICommandHandler<ITimeLineCommand, void>
  ) {}

  async subcribeTweetEvents(): Promise<void> {
    try {
      await this.channel.consume(
        'timeline.tweet.created',

        async (msg) => {
          if (!msg) return

          try {
            const event: ITweetCreatedEvent = JSON.parse(msg.content.toString())

            await this.updateTimeline.execute({
              dto: {
                tweetId: event.tweetId,
                userId: event.userId,
              },
            })

            this.channel.ack(msg)
          } catch (error) {
            this.channel.nack(msg, false, false)
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
