import express, { Request, Response } from 'express'
import { setupAuth } from './modules/auth'
import { sequelize } from './share/component/sequelize'
import { errorHandlingMiddleware } from './share/middleware/errorHandling'
import RedisConnection, { redis } from './share/component/redis'
import { config } from './share/component/config'
import cors from 'cors'


;import { setupUserProfile } from './modules/user'
(async () => {
  try {
    await sequelize.authenticate()

    await sequelize.sync({ alter: true })

    await RedisConnection.connect()

    const app = express()
    const port = config.app.port || 3001

    app.use(express.json())

    app.use(cors())

    app.get('/check-health', async (req: Request, res: Response) => {
      try {
        // Check Database
        await sequelize.authenticate()

        // Check Redis
        await redis.ping()

        res.json({
          status: 200,
          message: 'Server is healthy',
          services: {
            database: 'connected',
            redis: 'connected',
          },
        })
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: 'Health check failed',
          error: (error as Error).message,
        })
      }
    })

    app.use('/api/v1/auth', setupAuth(sequelize, redis))
    app.use('/api/v1/user', setupUserProfile(sequelize))

    app.use(errorHandlingMiddleware)

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (err) {
    console.error('Unable to connect to the database:', err)
    process.exit(1)
  }
})()
