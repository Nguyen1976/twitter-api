import { ICommandHandler } from '~/share/interface'
import { ITimeLineCommand } from '../interfaces/TimeLineCommand'
import Redis from 'ioredis'

export class UpdateTimelineCmdHandler
  implements ICommandHandler<ITimeLineCommand, void>
{
  constructor(private repoRedis: Redis) {}

  execute(command: ITimeLineCommand): Promise<void> {
    const { tweetId, userId } = command.dto

    console.log(`Update timeline for tweetId: ${tweetId}, userId: ${userId}`)
    //lấy danh sách followers của userId
    return {} as any
  }
}

//timeline nhận vào tweetId và userId để update timeline
