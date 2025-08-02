import express, { Request, Response } from 'express'
import { config } from 'dotenv'
import { setupAuth } from './modules/auth'
import { sequelize } from './share/component/sequelize'
import { errorHandlingMiddleware } from './share/middleware/errorHandling'
import RedisConnection, { redis } from './share/component/redis'

config()
;(async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected')

    await sequelize.sync({ alter: true })

    await RedisConnection.connect()

    const app = express()

    app.use(express.json())

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

    app.use('/v1', setupAuth(sequelize, redis))

    app.use(errorHandlingMiddleware)

    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
    
  } catch (err) {
    console.error('Unable to connect to the database:', err)
    process.exit(1)
  }
})()
