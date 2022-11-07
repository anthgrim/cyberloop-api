import { origin } from '../types'
import allowedOrigins from './allowedOrigins'

const corsOptions: origin = {
  origin: (origin: string, callback: any) => {
    if (allowedOrigins.includes(origin) || origin === undefined) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed By CORS'))
    }
  },
  optionsSuccessStatus: 200
}

export default corsOptions
