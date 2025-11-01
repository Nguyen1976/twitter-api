import { UpdateTimelineCmdHandler } from './use-cases/UpdateTimelineUseCase';


export function buildTweetUseCases(
  infra: ReturnType<
    typeof import('./timeline.infras').buildTimelineInfrastructure
  >
) {
  return {
    updateTimeline: new UpdateTimelineCmdHandler(
      infra.timelineRedisRepository,
      infra.timelineMongoDBRepository
    ),
  }
}
