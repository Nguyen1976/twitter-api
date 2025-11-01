import { ICommandHandler } from '~/share/interface'
import { IFollowMongoDBRepository } from '../domain/ports/FollowRepositories'
import { CreateFollowCommand } from '../domain/ports/FollowCommands'

export class CreateFollowUseCase
  implements ICommandHandler<CreateFollowCommand, boolean>
{
  constructor(private readonly repository: IFollowMongoDBRepository) {}

  async execute(command: CreateFollowCommand): Promise<boolean> {
    const { dto } = command
    const { followerId, followeeId } = dto
    await this.repository.insert({ followerId, followeeId })
    return true
  }
}
