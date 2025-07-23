import express, { Request, Response } from 'express'

import { config } from 'dotenv'

config()
;(() => {
  const app = express()
  app.use(express.json())

  app.get('/check-health', (req: Request, res: Response) => {
    res.json({status: 200, message: 'Server is healthy'})
  })


  app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })
})()
