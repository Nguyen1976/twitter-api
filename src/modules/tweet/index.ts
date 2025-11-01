import { Sequelize } from "sequelize";
import { init } from "./infra/sequelize";
import { buildTweetInfrastructure } from "./tweet.infras";
import { buildTweetUseCases } from "./tweet.usecases";
import { buildTweetRouter } from "./tweet.routes";
import { Redis } from "ioredis";
import { Channel } from "amqplib";


export function setupTweet(sequelize: Sequelize, redis: Redis, channel: Channel) {
  init(sequelize)

  const infra = buildTweetInfrastructure(sequelize, redis, channel)
  const usecases = buildTweetUseCases(infra)
  

  return buildTweetRouter(usecases, infra)
}
