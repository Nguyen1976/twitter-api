import { TweetType } from "../../domain/types"

export interface CreateTweetDTO {
  userId: string
  contentText?: string
  type?: TweetType
  parentTweetId?: string
}
