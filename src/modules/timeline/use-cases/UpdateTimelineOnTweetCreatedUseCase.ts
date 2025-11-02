import { ICommandHandler } from '~/share/interface'
import Redis from 'ioredis'
import {
  ITimelineMongoDBRepository,
  ITimelineRedisRepository,
} from '../interfaces/TimelineRepositories'
import { ITimeLineOnTweetCreatedCommand } from '../interfaces/TimeLineCommand'

export class UpdateTimelineOnTweetCreatedUseCase
  implements ICommandHandler<ITimeLineOnTweetCreatedCommand, void>
{
  constructor(
    private repoRedis: ITimelineRedisRepository,
    private mongoRepo: ITimelineMongoDBRepository
  ) {}

  execute(command: ITimeLineOnTweetCreatedCommand): Promise<void> {
    const { tweetId, userId } = command.dto

    console.log(`Update timeline for tweetId: ${tweetId}, userId: ${userId}`)
    //lấy danh sách followers của userId

    //Tạm thời dừng và tạo thêm follow service để xử lý
    return {} as any
  }
}

//timeline nhận vào tweetId và userId để update timeline
