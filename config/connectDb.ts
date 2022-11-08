/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { MongooseOptions } from '../types'
dotenv.config()

export const connectDB = async () => {
  try {
    const uri: any = process.env.DB_URI
    const options: MongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    await mongoose.connect(uri, options, () =>
      console.log('Database Connection: OK')
    )
  } catch (error) {
    console.log(error)
  }
}
