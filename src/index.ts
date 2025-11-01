import express from 'express'
import { setupAuth } from './modules/auth'
import { sequelize } from './share/component/sequelize'
import { errorHandlingMiddleware } from './share/middleware/errorHandling'
import RedisConnection from './share/component/redis'
import { config } from './share/component/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { setupUserProfile } from './modules/user'
import { setupTweet } from './modules/tweet'
import { setupTimelineModule } from './modules/timeline'
import { RabbitMQConnection } from './share/component/rabbitmq/connection'
import { Channel } from 'amqplib'
import { MongoDBConnection } from './share/component/mongodb'
import { setupFollow } from './modules/follow'
;(async () => {
  try {
    await sequelize.authenticate()

    await sequelize.sync({ alter: true })

    const redisConnection = new RedisConnection()
    const redis = redisConnection.getInstance()
    await redisConnection.connect()

    const mongoDBConnection = new MongoDBConnection()
    const mongoDB = await mongoDBConnection.connect()

    const channel: Channel = await new RabbitMQConnection().connect()

    const app = express()
    const port = config.app.port || 3001

    app.use(cookieParser())
    app.use(
      cors({
        origin: 'http://localhost:3000', // domain frontend
        credentials: true,
      })
    )
    app.use(express.json())

    // app.get('/check-health', async (req: Request, res: Response) => {
    //   try {
    //     // Check Database
    //     await sequelize.authenticate()

    //     // Check Redis
    //     await redis.ping()

    //     res.json({
    //       status: 200,
    //       message: 'Server is healthy',
    //       services: {
    //         database: 'connected',
    //         redis: 'connected',
    //       },
    //     })
    //   } catch (error) {
    //     res.status(500).json({
    //       status: 500,
    //       message: 'Health check failed',
    //       error: (error as Error).message,
    //     })
    //   }
    // })

    app.use('/api/v1/auth', setupAuth(sequelize, redis))
    app.use('/api/v1/user', setupUserProfile(sequelize, redis))
    app.use('/api/v1/tweet', setupTweet(sequelize, redis, channel))
    app.use('/api/v1/follow', setupFollow(mongoDB))
    await setupTimelineModule(redis, channel, mongoDB)

    app.use(errorHandlingMiddleware)

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (err) {
    console.error('Unable to connect to the database:', err)
    process.exit(1)
  }
})()
