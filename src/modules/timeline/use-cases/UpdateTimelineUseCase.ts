import { ICommandHandler, IRedisRepository } from "~/share/interface";
import { ITimeLineCommand } from "../interfaces/TimeLineCommand";


export class UpdateTimelineUseCase implements ICommandHandler<ITimeLineCommand, void>{
  constructor(private repoRedis: IRedisRepository) {}

  execute(command: ITimeLineCommand): Promise<void> {
    const { tweetId, userId, createdAt } = command.dto
    //lấy danh sách followers của userId
    return {} as any
  }

  
}


//timeline nhận vào tweetId và userId để update timeline