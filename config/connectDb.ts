/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const connectDB = async () => {
  try {
    const uri: any = process.env.BB_URI

    await mongoose.connect(uri, () => console.log('Database Connection: OK'))
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
