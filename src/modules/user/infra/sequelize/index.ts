import { DataTypes, Model, Sequelize } from 'sequelize'

export class UserProfilePersistence extends Model {}

export const modelName = 'UserProfile'

export function initUserProfile(sequelize: Sequelize) {
  UserProfilePersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'user_id',
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'display_name',
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'avatar_url',
      },
      headerImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'header_image_url',
      },
      followerCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'follower_count',
      },
      followingCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'following_count',
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'user_profiles',
    }
  )
}
