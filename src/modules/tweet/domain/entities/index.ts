import { MediaType } from 'express'
import { TweetType } from '../types'

// Tweet chính + reply + quote + retweet đều trong 1 interface
export interface Tweet {
  video: undefined
  id: string
  userId: string
  contentText?: string // null hoặc undefined nếu retweet chay
  type: TweetType
  parentTweetId?: string // dùng cho reply, quote, retweet (FK đến tweet gốc)
  likeCount: number
  replyCount: number
  retweetCount: number
  media_url: string
  media_type: MediaType
  createdAt: Date
  updatedAt: Date
}
