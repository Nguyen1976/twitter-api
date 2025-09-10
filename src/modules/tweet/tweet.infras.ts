import { Sequelize } from 'sequelize'
import { MySQLTweetRepository } from './infra/repositories/mysql.repository'
import { jwt } from 'zod'
import { JwtService } from '~/share/component/jwt'

export function buildTweetInfrastructure(sequelize: Sequelize) {
  return {
    tweetRepository: new MySQLTweetRepository(sequelize),
    jwtService: new JwtService(),
  }
}
