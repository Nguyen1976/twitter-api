import { ICommandHandler } from '~/share/interface'
import { ITimeLineCommand } from '../interfaces/TimeLineCommand'
import Redis from 'ioredis'
import {
  ITimelineMongoDBRepository,
  ITimelineRedisRepository,
} from '../interfaces/TimelineRepositories'

export class UpdateTimelineCmdHandler
  implements ICommandHandler<ITimeLineCommand, void>
{
  constructor(
    private repoRedis: ITimelineRedisRepository,
    private mongoRepo: ITimelineMongoDBRepository
  ) {}

  execute(command: ITimeLineCommand): Promise<void> {
    const { tweetId, userId } = command.dto

    console.log(`Update timeline for tweetId: ${tweetId}, userId: ${userId}`)
    //lấy danh sách followers của userId

    //Tạm thời dừng và tạo thêm follow service để xử lý
    return {} as any
  }
}

//timeline nhận vào tweetId và userId để update timeline
