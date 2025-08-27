import { DataTypes, Model, Sequelize } from 'sequelize'

export class TweetMediaPersistence extends Model {}

export const modelName = 'TweetMedia'

export function initTweetMedia(sequelize: Sequelize) {
  TweetMediaPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tweetId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'tweet_id',
      },
      mediaUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'media_url',
      },
      type: {
        type: DataTypes.ENUM('IMAGE', 'VIDEO', 'GIF'),
        allowNull: false,
        field: 'type',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: false,
      tableName: 'tweet_media',
    }
  )

  return TweetMediaPersistence
}
