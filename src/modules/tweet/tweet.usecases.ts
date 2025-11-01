import { CreateNewTweetCmdHandler } from './use-cases/createTweet'

export function buildTweetUseCases(
  infra: ReturnType<typeof import('./tweet.infras').buildTweetInfrastructure>
) {
  return {
    createTweet: new CreateNewTweetCmdHandler(
      infra.tweetRepository,
      infra.uploadImageQueue,
      infra.tweetEventPublisher
    ),
  }
}
