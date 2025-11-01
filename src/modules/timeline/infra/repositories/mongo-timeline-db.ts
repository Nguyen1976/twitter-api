import { BaseMongoDBRepository } from '~/share/repository/mongodb'
import { ITimelineMongoDBRepository } from '../../interfaces/TimelineRepositories'
import { Db, Filter, ObjectId, UpdateFilter } from 'mongodb'
import { Timeline } from '../../domain/entities'
import { TimelineCondDTO, TimelineUpdateDTO } from '../../interfaces/dtos'

export class MongoDBTimelineRepository
  extends BaseMongoDBRepository<Timeline, TimelineCondDTO, TimelineUpdateDTO>
  implements ITimelineMongoDBRepository
{
  protected buildUpdateDocument(updateDto: {
    tweets: { tweetId: string; userId: string }[]
  }) {
    throw new Error('Method not implemented.')
  }
  protected toEntity(doc: any): Timeline {
    return new Timeline(doc.userId, doc.tweetId)
  }
  protected toDocument(entity: Timeline) {
    const doc: any = {
      userId: entity.userId,
      tweetId: entity.tweetId,
    }

    const maybeId = (entity as any).id
    if (maybeId) {
      doc._id = new ObjectId(maybeId)
    }

    return doc
  }

  protected buildFilter(cond: TimelineCondDTO): Filter<any> {
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

    if (cond.userId) filter.userId = cond.userId
    if (cond.tweetId) filter.tweetId = cond.tweetId

    return filter
  }

  constructor(mongoClient: Db) {
    super(mongoClient, 'timelines')
  }
}
