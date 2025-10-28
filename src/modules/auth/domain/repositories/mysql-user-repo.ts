import { BaseRepositorySequelize } from '~/share/repository/sequelize'
import { UserCondDTO, UserUpdateDTO } from '../dtos/dto'
import { modelName } from '~/modules/auth/infra/sequelize'
import { Sequelize } from 'sequelize'
import { User } from '../../domain/entities/user'
import { IUserRepository } from '../../interfaces/userRepository'

export class MySQLUserRepository
  extends BaseRepositorySequelize<User, UserCondDTO, UserUpdateDTO>
  implements IUserRepository
{
  constructor(sequelize: Sequelize) {
    super(sequelize, modelName)
  }
}
