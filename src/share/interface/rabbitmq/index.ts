export interface ITweetCreatedEvent {
  tweetId: string
  userId: string
}

export interface IFollowCreatedEvent {
  followerId: string
  followeeId: string
}
