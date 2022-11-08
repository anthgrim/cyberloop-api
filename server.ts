/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import express from 'express'
import { connectDB } from './config/connectDb'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import credentials from './middlewares/credentials'
import corsOptions from './config/corsOptions'
import companyRoutes from './routes/companyRoutes'
import userRoutes from './routes/userRoutes'
import * as dotenv from 'dotenv'

dotenv.config()

// Initialize PORT and instantiate express application
const PORT = process.env.PORT || 8080
const app = express()

// Connect to Database
// eslint-disable-next-line @typescript-eslint/no-floating-promises
connectDB()

// Middlewares
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

// Public Routes
app.use('/api/company', companyRoutes)
app.use('/api/user', userRoutes)
app.get('/', (_req, res) => {
  res.send(`Running on port ${PORT}`)
})

// Initialize app when mongodb connection is open
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
)
