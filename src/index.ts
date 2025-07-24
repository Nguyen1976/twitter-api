import express, { Request, Response } from 'express'
import { config } from 'dotenv'
import { setupAuth } from './modules/auth'
import { sequelize } from './share/component/sequelize'

config()
;(async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected')

    await sequelize.sync({ alter: true }) 

    const app = express()
    app.use(express.json())

    app.get('/check-health', (req: Request, res: Response) => {
      res.json({ status: 200, message: 'Server is healthy' })
    })

    app.use('/v1', setupAuth(sequelize))

    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
  } catch (err) {
    console.error('Unable to connect to the database:', err)
  }
})()
