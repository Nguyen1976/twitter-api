import { DataTypes, Model, Sequelize } from 'sequelize'

export class TweetPersistence extends Model {}

export const modelName = 'Tweet'

export function initTweet(sequelize: Sequelize) {
  TweetPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      contentText: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'content_text',
      },
      type: {
        type: DataTypes.ENUM('TWEET', 'REPLY', 'QUOTE', 'RETWEET'),
        allowNull: false,
        defaultValue: 'TWEET',
        field: 'type',
      },
      parentTweetId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'parent_tweet_id',
      },
      likeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'like_count',
      },
      replyCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'reply_count',
      },
      retweetCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'retweet_count',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      tableName: 'tweets',
    }
  )

  return TweetPersistence
}
