import { BaseMongoDBRepository } from '~/share/repository/mongodb'
import { Db, Filter, ObjectId } from 'mongodb'
import { Follow } from '../../domain/entities/follow'
import { FollowCondDTO, UpdateFollowDTO } from '../../domain/dtos'
import { IFollowMongoDBRepository } from '../../domain/ports/FollowRepositories'

export class MongoDBFollowRepository
  extends BaseMongoDBRepository<Follow, FollowCondDTO, UpdateFollowDTO>
  implements IFollowMongoDBRepository
{
  protected buildUpdateDocument(updateDto: UpdateFollowDTO) {
    throw new Error('Method not implemented.')
  }
  protected toEntity(doc: any): Follow {
    return new Follow(doc.followerId, doc.followeeId)
  }

  protected toDocument(entity: Follow) {
    const doc: any = {
      followerId: entity.followerId,
      followeeId: entity.followeeId,
    }

    const maybeId = (entity as any).id
    if (maybeId) {
      doc._id = new ObjectId(maybeId)
    }

    return doc
  }

  protected buildFilter(cond: FollowCondDTO): Filter<any> {
    const filter: any = {}

    if (!cond) return filter

    if ((cond as any).id) {
      try {
        filter._id = new ObjectId((cond as any).id)
      } catch {
        // if invalid id string, fallback to matching nothing
        filter._id = (cond as any).id
      }
    }

    // if (cond?.followerId) filter.followerId = cond.followerId
    // if (cond?.followeeId) filter.followeeId = cond.followeeId

    return filter
  }

  constructor(mongoClient: Db) {
    super(mongoClient, 'Follows')
  }
}
