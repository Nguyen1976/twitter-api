import { Sequelize } from 'sequelize'
import { initTweetMedia } from './TweetMedia'
import { initTweet } from './Tweet'

export function init(sequelize: Sequelize) {
  const Tweet = initTweet(sequelize)
  const TweetMedia = initTweetMedia(sequelize)

  Tweet.hasMany(TweetMedia, {
    foreignKey: 'tweet_id',
    as: 'media',
  })
  TweetMedia.belongsTo(Tweet, {
    foreignKey: 'tweet_id',
    as: 'tweet',
  })
}
