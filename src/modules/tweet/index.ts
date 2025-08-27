import { Sequelize } from "sequelize";
import { init } from "./infra/sequelize";


export function setupTweet(sequelize: Sequelize) {
  init(sequelize)

  return {}
}
