import { Sequelize } from 'sequelize'
import { BaseRepositorySequelize } from '~/share/repository/sequelize'
import {
  UserProfile,
  UserProfileCondDTO,
  UserProfileUpdateDTO,
} from '../../interfaces/dtos'
import { modelName } from '../sequelize'
import { IUserProfileRepository } from '../../interfaces/userProfileRepository'

export class MySQLUserProfileRepository
  extends BaseRepositorySequelize<
    UserProfile,
    UserProfileCondDTO,
    UserProfileUpdateDTO
  >
  implements IUserProfileRepository
{
  constructor(sequelize: Sequelize) {
    super(sequelize, modelName)
  }
}

