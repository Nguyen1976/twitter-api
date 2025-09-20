import { MediaType, TweetType } from '../types'

// Tweet chính + reply + quote + retweet đều trong 1 interface
export class Tweet {
  userId: string;
  contentText?: string;
  type: TweetType;
  parentTweetId?: string;
  likeCount: number;
  replyCount: number;
  retweetCount: number;
  mediaUrl: string;
  mediaType: MediaType;
  createdAt?: Date;
  updatedAt?: Date;
  id: any;

  constructor(
    userId: string,
    contentText: string | undefined,
    type: TweetType,
    parentTweetId: string | undefined,
    likeCount: number,
    replyCount: number,
    retweetCount: number,
    mediaUrl: string,
    mediaType: MediaType,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.userId = userId;
    this.contentText = contentText;
    this.type = type;
    this.parentTweetId = parentTweetId;
    this.likeCount = likeCount;
    this.replyCount = replyCount;
    this.retweetCount = retweetCount;
    this.mediaUrl = mediaUrl;
    this.mediaType = mediaType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}