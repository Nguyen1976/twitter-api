import { ICommandHandler } from '~/share/interface'
import { ITimelineOnFollowCreatedCommand } from '../interfaces/TimeLineCommand'
import Redis from 'ioredis'
import {
  ITimelineMongoDBRepository,
  ITimelineRedisRepository,
} from '../interfaces/TimelineRepositories'
import { UpdateTimelineOnFollowCreatedDTO } from '../interfaces/dtos'

export class UpdateTimelineOnFollowCreatedUseCase
  implements ICommandHandler<ITimelineOnFollowCreatedCommand, void>
{
  constructor(
    private repoRedis: ITimelineRedisRepository,
    private mongoRepo: ITimelineMongoDBRepository
  ) {}

  execute(command: ITimelineOnFollowCreatedCommand): Promise<void> {
    const { followerId, followeeId } = command.dto

    console.log(
      `Update timeline for followerId: ${followerId}, followeeId: ${followeeId}`
    )
    //lấy danh sách followers của userId

    //Tạm thời dừng và tạo thêm follow service để xử lý
    return {} as any
  }
}

//timeline nhận vào tweetId và userId để update timeline
