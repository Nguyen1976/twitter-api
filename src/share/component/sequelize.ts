import { config } from './config'
import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
  database: config.db.dbName as string,
  username: config.db.user as string,
  password: config.db.password as string,
  host: config.db.host as string,
  port: config.db.port as number,
  dialect: config.db.dbType as 'mysql',
  pool: {
    max: 20,
    min: 2,
    acquire: 30000,
    idle: 60000,
  },
  logging: console.log,
})
