import { Sequelize } from "sequelize";
import { init } from "./infra/sequelize";
import { buildTweetInfrastructure } from "./tweet.infras";
import { buildTweetUseCases } from "./tweet.usecases";
import { buildTweetRouter } from "./tweet.routes";


export function setupTweet(sequelize: Sequelize) {
  init(sequelize)

  const infra = buildTweetInfrastructure(sequelize)
  const usecases = buildTweetUseCases(infra)
  

  return buildTweetRouter(usecases, infra)
}
