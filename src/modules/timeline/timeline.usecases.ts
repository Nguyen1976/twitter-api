import { UpdateTimelineCmdHandler } from './use-cases/updateTimelineUseCase';


export function buildTweetUseCases(
  infra: ReturnType<typeof import('./timeline.infras').buildTimelineInfrastructure>
) {
  return {
    updateTimeline: new UpdateTimelineCmdHandler(
        infra.redis,
    ),
  }
}
