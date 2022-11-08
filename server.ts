import express from 'express'
import { MongooseOptions } from './types'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import credentials from './middlewares/credentials'
import corsOptions from './config/corsOptions'
import companyRoutes from './routes/companyRoutes'
import * as dotenv from 'dotenv'

dotenv.config()

// Initialize PORT and instantiate express application
const PORT = process.env.PORT ?? 8080
const app = express()

// Connect to Database
// eslint-disable-next-line @typescript-eslint/no-floating-promises
const dbUri: any = process.env.DB_URI
const options: MongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
mongoose.connect(dbUri, options, () => console.log('Connected to db'))

// Middlewares
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

// Public Routes
app.use('/api/company', companyRoutes)
app.get('/', (_req, res) => {
  res.send(`Running on port ${PORT}`)
})

// Initialize app when mongodb connection is open
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
)
