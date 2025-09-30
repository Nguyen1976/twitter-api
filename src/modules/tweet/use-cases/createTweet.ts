import { ICommandHandler } from '~/share/interface'
import { CreateTweetCommand } from '../interfaces/tweetCommands'
import { Tweet } from '../domain/entities'
import { ITweetRepository } from '../interfaces/tweetRepository'
import { MediaType as TweetMediaType, TweetType } from '../domain/types'
import { TweetEventPublisher } from '~/share/component/rabbitmq/publishers/tweetEventPublisher'

export class CreateNewTweetCmdHandler
  implements ICommandHandler<CreateTweetCommand, Tweet>
{
  constructor(
    private readonly repository: ITweetRepository,
    private readonly uploadTweetImageQueue: any,
    private tweetEventPublisher: TweetEventPublisher
  ) {}

  async execute(command: CreateTweetCommand): Promise<Tweet> {
    const {
      userId,
      contentText,
      type,
      parentTweetId,
      video,
      images,
      createdAt,
      updatedAt,
    } = command.dto
    let mediaType = video ? TweetMediaType.VIDEO : TweetMediaType.IMAGE
    const tweet = new Tweet(
      userId,
      contentText,
      type as TweetType,
      parentTweetId,
      0,
      0,
      0,
      '',
      mediaType as TweetMediaType,
      createdAt,
      updatedAt
    )

    let inserted = await this.repository.insert(tweet)

    //sẽ tạo queue để upload images và video sau đó từ mảng url của images hoặc video có thể tạo thành 1 text url trong db sau đó insert vào trong db
    //=> trên thực tế lên để image upload sau cùng và nó sẽ gọi update vào db

    if (video) {
      //upload video to cloud
    } else {
      this.uploadTweetImageQueue.uploadImage({
        id: inserted?.id,
        images,
      })
    }

    //future call timeline service to update timeline
    this.tweetEventPublisher.publishTweetCreated({
      tweetId: inserted!.id,
      userId: inserted!.userId,
      createdAt: new Date().toISOString(),
    })

    return inserted as Tweet
  }
}
