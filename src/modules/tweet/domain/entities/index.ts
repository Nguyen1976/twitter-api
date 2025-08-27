import { MediaType } from "express"
import { TweetType } from "../types"

// Tweet chính + reply + quote + retweet đều trong 1 interface
export interface Tweet {
  id: string
  userId: string
  contentText?: string // null hoặc undefined nếu retweet chay
  type: TweetType
  parentTweetId?: string // dùng cho reply, quote, retweet (FK đến tweet gốc)
  likeCount: number
  replyCount: number
  retweetCount: number
  createdAt: Date
  updatedAt: Date
}

// Media kèm theo tweet
export interface TweetMedia {
  id: string
  tweetId: string
  mediaUrl: string
  type: MediaType
}


// export interface Like {
//   id: string
//   userId: string
//   tweetId: string
//   createdAt: Date
// }

