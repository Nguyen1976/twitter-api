import { UpdateTimelineOnTweetCreatedUseCase } from './use-cases/UpdateTimelineOnTweetCreatedUseCase'
import { UpdateTimelineOnFollowCreatedUseCase } from './use-cases/UpdateTimelineOnUserFollowedUseCase'

export function buildTweetUseCases(
  infra: ReturnType<
    typeof import('./timeline.infras').buildTimelineInfrastructure
  >
) {
  return {
    updateTimelineOnTweetCreatedUseCase:
      new UpdateTimelineOnTweetCreatedUseCase(
        infra.timelineRedisRepository,
        infra.timelineMongoDBRepository
      ),
    updateTimelineOnFollowCreatedUseCase:
      new UpdateTimelineOnFollowCreatedUseCase(
        infra.timelineRedisRepository,
        infra.timelineMongoDBRepository
      ),
  }
}
