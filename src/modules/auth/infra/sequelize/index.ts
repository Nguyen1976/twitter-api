import { DataTypes, Model, Sequelize } from 'sequelize'

export class UserPersitence extends Model {}

export const modelName = 'User'

export function init(sequelize: Sequelize) {
  UserPersitence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 'false',
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'users',
    }
  )
}
