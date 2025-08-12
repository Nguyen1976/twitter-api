import { Sequelize } from 'sequelize'
import { MySQLUserProfileRepository } from './infra/repositories/my-sql-user-profile'
import { AuthGrpcClient } from './infra/grpc/client'
import { JwtService } from '~/share/component/jwt'

export function buildUserInfrastructure(sequelize: Sequelize) {
  return {
    repository: new MySQLUserProfileRepository(sequelize),
    authGrpcClient: new AuthGrpcClient(),
    jwtService: new JwtService(),
  }
}
