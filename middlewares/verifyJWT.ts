import User from '../models/userModel'
import * as jwt from 'jsonwebtoken'
import { SpecialRequest, TokenPayload } from '../types'
import { Response, NextFunction } from 'express'

/**
 * @desc Verifies jwt token on request
 */
export const verifyJWT = async (
  req: SpecialRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Get authorization headers
  const authHeaders = req.headers.authorization ?? req.headers.Authorization

  if (typeof authHeaders === 'string') {
    if (!authHeaders?.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Not Auhorized'
      })
      return res.end()
    }
  }

  // Extract token
  const token: any =
    typeof authHeaders === 'string' && authHeaders.split(' ')[1]

  try {
    if (token === '') {
      return res.status(401).json({
        message: 'Not Authorized'
      })
    }

    // Validate token

    const accessTokenSecret: string | undefined =
      process.env.ACCESS_TOKEN_SECRET

    if (accessTokenSecret === undefined) {
      return res.status(500).json({
        message: 'Missing refresh token secret on server'
      })
    }

    const decoded = jwt.verify(token, accessTokenSecret) as TokenPayload

    const targetUser = await User.findById(decoded.id)

    req.companyId = targetUser?.companyId
    req.id = targetUser?._id
    req.isAdmin = targetUser?.admin

    next()
  } catch (error) {
    return res.status(403).json({
      message: 'Expired Token'
    })
  }
}
