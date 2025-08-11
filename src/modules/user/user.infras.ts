import { Sequelize } from "sequelize";
import { MySQLUserProfileRepository } from "./infra/repositories/my-sql-user-profile";
import Redis from "ioredis";


export function buildUserInfrastructure(sequelize: Sequelize) {
  return {
    repository: new MySQLUserProfileRepository(sequelize),
  }
}
