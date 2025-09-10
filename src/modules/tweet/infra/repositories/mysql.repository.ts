import { BaseRepositorySequelize } from "~/share/repository/sequelize";
import { Tweet } from "../../domain/entities";
import { ITweetRepository } from "../../interfaces/tweetRepository";
import { Sequelize } from "sequelize";
import { TweetCondDTO, UpdateTweetDTO } from "../../interfaces/dtos";
import { modelName } from "../sequelize";

export class MySQLTweetRepository
  extends BaseRepositorySequelize<Tweet, TweetCondDTO, UpdateTweetDTO>
  implements ITweetRepository
{
  constructor(sequelize: Sequelize) {
    super(sequelize, modelName)
  }
}
