import { RabbitMQConnection } from '~/share/component/rabbitmq/connection'
import { ICommandHandler } from '~/share/interface'
import { Channel } from 'amqplib'
import {
  IFollowCreatedEvent,
  ITweetCreatedEvent,
} from '~/share/interface/rabbitmq'
import { UpdateTimelineOnTweetCreatedDTO } from '../../dtos'
import {
  ITimelineOnFollowCreatedCommand,
  ITimeLineOnTweetCreatedCommand,
} from '../../TimeLineCommand'

export class TimelineEventSubscriber {
  constructor(
    private readonly updateTimelineOnTweetCreated: ICommandHandler<
      ITimeLineOnTweetCreatedCommand,
      void
    >,
    protected readonly updateTimelineOnFollowCreated: ICommandHandler<
      ITimelineOnFollowCreatedCommand,
      void
    >,
    private readonly channel: Channel
  ) {}

  async subscribeTweetCreatedEvents(): Promise<void> {
    try {
      await this.channel.consume(
        'timeline.tweet.created',

        async (msg) => {
          if (!msg) return

          try {
            const event: ITweetCreatedEvent = JSON.parse(msg.content.toString())

            await this.updateTimelineOnTweetCreated.execute({
              dto: {
                tweetId: event.tweetId,
                userId: event.userId,
              },
            })

            this.channel.ack(msg)
          } catch (error) {
            this.channel.nack(msg, false, false) //message drop
            // this.channel.nack(msg, false, true)//message retry
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

  async subscribeFollowCreatedEvents(): Promise<void> {
    try {
      await this.channel.consume(
        'timeline.follow.created',

        async (msg) => {
          if (!msg) return

          try {
            const event: IFollowCreatedEvent = JSON.parse(
              msg.content.toString()
            )

            await this.updateTimelineOnFollowCreated.execute({
              dto: {
                followerId: event.followerId,
                followeeId: event.followeeId,
              },
            })

            this.channel.ack(msg)
          } catch (error) {
            this.channel.nack(msg, false, false) //message drop
            // this.channel.nack(msg, false, true)//message retry
            console.error('Error processing follow.created event:', error)
          }
        },
        { noAck: false } // đảm bảo message được ack
      )
    } catch (error) {
      console.log('Timeline service subscribed to follow events')
      throw error
    }
  }
}
