import { RabbitMQConnection } from '../connection'
import { ITweetCreatedEvent } from '../publishers/tweetEventPublisher'


export class TimelineEventSubscriber {
  private channel = RabbitMQConnection.getChannel()

  constructor(private timelineService: any) {}

  async subcribeTweetEvents(): Promise<void> {
    try {
      await this.channel.consume(
        'timeline.tweet.created',

        async (msg) => {
          if (!msg) return

          try {
            const event: ITweetCreatedEvent = JSON.parse(msg.content.toString())

            await this.timelineService.addTweetToFollowersTimelines(event)

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
