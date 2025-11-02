import { UpdateTimelineOnFollowCreatedDTO, UpdateTimelineOnTweetCreatedDTO } from './dtos'

export interface ITimeLineOnTweetCreatedCommand {
  dto: UpdateTimelineOnTweetCreatedDTO
}

export interface ITimelineOnFollowCreatedCommand {
  dto: UpdateTimelineOnFollowCreatedDTO
}
