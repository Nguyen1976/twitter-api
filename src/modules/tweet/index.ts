import { Sequelize } from "sequelize";
import { init } from "./infra/sequelize";
import { buildTweetInfrastructure } from "./tweet.infras";
import { buildTweetUseCases } from "./tweet.usecases";
import { buildTweetRouter } from "./tweet.routes";
import { Redis } from "ioredis";


export function setupTweet(sequelize: Sequelize, redis: Redis) {
  init(sequelize)

  const infra = buildTweetInfrastructure(sequelize, redis)
  const usecases = buildTweetUseCases(infra)
  

  return buildTweetRouter(usecases, infra)
}
