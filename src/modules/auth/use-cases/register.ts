import { v7 } from 'uuid'
import { User } from '../domain/entities/user'
import { ICommandHandler, IEmailService } from '~/share/interface'
import { UserAlreadyExistsError } from '../domain/errors/user-errors'
import { CreateCommand } from '../interfaces/userCommands'
import { IUserRepository } from '../interfaces/userRepository'
import { IUserProfileService } from '~/share/interface/grpc'
import { IPasswordHashService } from '../interfaces'

export class CreateNewUserCmdHandler
  implements ICommandHandler<CreateCommand, string>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly passwordHashService: IPasswordHashService,
    private readonly emailService: IEmailService,
    private readonly userProfileGrpcClient: IUserProfileService
  ) {}

  async execute(command: CreateCommand): Promise<string> {
    const isExist = await this.repository.findByCond({
      username: command.dto.username,
      email: command.dto.email,
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
      birthDate: command.dto.birthDate,
      password: hashedPassword,
    }

    await this.repository.insert(newUser)

    await this.userProfileGrpcClient.CreateUserProfile({
      userId: newUser.id,
    })

    this.emailService
      .sendWelcomeEmail(newUser.email, newUser.username)
      .catch((err) => {
        console.error('Failed to send welcome email:', err)
      })

    return newId
  }
}
