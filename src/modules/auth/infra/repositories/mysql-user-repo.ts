import { BaseRepositorySequelize } from '~/share/repository/sequelize'
import { UserCondDTO, UserUpdateDTO } from '../../interfaces/dtos/dto'
import { modelName } from '~/modules/auth/infra/sequelize'
import { Sequelize } from 'sequelize'
import { User } from '../../domain/entities/user'
import { IUserRepository } from '../../interfaces'
import { Op } from 'sequelize'

export class MySQLUserRepository
  extends BaseRepositorySequelize<User, UserCondDTO, UserUpdateDTO>
  implements IUserRepository
{
  constructor(sequelize: Sequelize) {
    super(sequelize, modelName)
  }
  async findByUsername(username: string): Promise<User | null> {
    const result = await this.sequelize.models.User.findOne({
      where: { username },
    })

    return result ? (result as any) : null
  }

  async isUsernameOrEmailTaken(
    username: string,
    email: string
  ): Promise<boolean> {
    const user = await this.sequelize.models.User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    })
    return !!user
  }
}
