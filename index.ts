import express, { RequestHandler } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user'
import authRoutes from './routes/auth'

// Setup env
dotenv.config()
const { DATABASE_CONNECTION_STRING, DATABASE, PORT } = process.env

// Setup database
if (!DATABASE_CONNECTION_STRING || !DATABASE) throw 'Database string is undefined'
mongoose
  .connect(`${DATABASE_CONNECTION_STRING}/${DATABASE}`, { useNewUrlParser: true })
  .then(() => console.log(`Connected to ${DATABASE_CONNECTION_STRING} and database=${DATABASE}`))
  .catch(err => console.log(err))

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Configure routes
app.use('/user', userRoutes)
app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
