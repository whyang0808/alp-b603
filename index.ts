import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import swaggerUi from "swagger-ui-express";
import userRoutes from './routes/user'
import authRoutes from './routes/auth'
import apiDocs from "./documentation/apidocs.json";
import companyRoutes from './routes/company'

// Setup env
dotenv.config()
const { DATABASE_CONNECTION_STRING, DATABASE, PORT, NODE_ENV } = process.env

// Setup database
if (!DATABASE_CONNECTION_STRING || !DATABASE) throw 'Database string is undefined'
mongoose
  .connect(`${DATABASE_CONNECTION_STRING}/${DATABASE}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log(`Connected to ${DATABASE_CONNECTION_STRING} and database=${DATABASE}`))
  .catch(err => console.log(err))

// Configure isProduction variable
const isProduction = NODE_ENV === 'production'

// Initiate our app
const app = express()

// Configure our app
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  origin: isProduction ? [] : ['http://localhost:3000', 'http://localhost:4000']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Configure routes
app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs))
app.use('/company', companyRoutes)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`))
