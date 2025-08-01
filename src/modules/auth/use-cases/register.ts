import { v7 } from 'uuid'
import { CreateCommand, IUserRepository } from '../interfaces'
import { User } from '../domain/entities/user'
import { ICommandHandler } from '~/share/interface'
import { UserAlreadyExistsError } from '../domain/errors/user-errors'
import { IPasswordHashService } from '../domain/services/index'

export class CreateNewUserCmdHandler
  implements ICommandHandler<CreateCommand, string>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly passwordHashService: IPasswordHashService
  ) {}

  async execute(command: CreateCommand): Promise<string> {
    const isExist = await this.repository.findByCond({
      username: command.dto.username,
      email: command.dto.email
    })
    if (isExist) {
      throw new UserAlreadyExistsError()
    }
    
    const newId = v7()

    const hashedPassword = await this.passwordHashService.hash(
      command.dto.password
    )

    const newUser: User = {
      id: newId,
      ...command.dto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.repository.insert(newUser)

    return newId
  }
}
