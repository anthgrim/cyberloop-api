import * as dotenv from 'dotenv'

dotenv.config()

export const accessSecret: any = process.env.ACCESS_TOKEN_SECRET
export const refreshSecret: any = process.env.REFRESH_TOKEN_SECRET
