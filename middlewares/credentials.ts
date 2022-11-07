import { allowedOrigins } from '../config/allowedOrigins'
import { SpecialRequest } from '../types'
import { Response, NextFunction } from 'express'

const credentials = async (
  req: SpecialRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const origin: any = req.headers.origin

  if (origin !== null) {
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Credentials', 'true')
    }
  }

  next()
}

export default credentials
