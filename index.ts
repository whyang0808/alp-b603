import express, { RequestHandler } from 'express'

const app = express()

const testHandler : RequestHandler = (req, res, next) => {
  res.status(200).json({ message: 'Hello World' })
}

app.use('/', testHandler)

app.listen(8000)
