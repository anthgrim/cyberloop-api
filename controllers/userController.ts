/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import User from '../models/userModel'
import * as bcrypt from 'bcrypt'
import { SpecialRequest, TokenPayload } from '../types'
import { Response } from 'express'
import jwt from 'jsonwebtoken'

/**
 * @desc   User sign in
 * @route  /api/user/signIn
 * @method POST
 * @access public
 */
export const signIn = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Get fields from request body
  const { email, password } = req.body

  // Verify required fields
  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing required fields'
    })
  }

  try {
    // Get target user
    const targetUser = await User.findOne({ email })

    if (!targetUser) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, targetUser.password)

    if (!isValidPassword) {
      return res.status(403).json({
        message: 'Invalid password'
      })
    }

    // Get token payload
    const tokenPayload: TokenPayload = {
      id: targetUser._id
    }

    // Get token secrets
    const accessTokenSecret: any = process.env.ACCESS_TOKEN_SECRET
    const refreshTokenSecret: any = process.env.REFRESH_TOKEN_SECRET

    // Generate jwt token
    const accessToken = jwt.sign(tokenPayload, accessTokenSecret, {
      expiresIn: '15m'
    })

    const refreshToken = jwt.sign(tokenPayload, refreshTokenSecret, {
      expiresIn: '1d'
    })

    // Set cookie
    res.cookie('token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 6000
    })

    // Add refresh token to db
    targetUser.refreshToken = refreshToken
    await targetUser.save()

    return res.status(200).json({
      message: `Welcome, ${targetUser.firstName}!`,
      accessToken
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}

/**
 * @desc   Sign out user
 * @route  /api/user/signOut
 * @method POST
 * @access public
 */
export const signOut = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  const cookies = req.cookies

  if (!cookies?.token) {
    res.sendStatus(204)
    res.end()
    return
  }

  const refreshToken: any = cookies.token

  if (!refreshToken) {
    res.sendStatus(204)
    res.end()
    return
  }

  try {
    // Get target user
    const targetUser = await User.findOne({ refreshToken }).exec()

    if (!targetUser) {
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })

      res.sendStatus(204)
      res.end()
      return
    }

    // update target user in db
    targetUser.refreshToken = ''
    await targetUser.save()

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })

    return res.sendStatus(204)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}

/**
 * @desc   Get a new access token using refresh token
 * @route  /api/user/refreshToken
 * @method GET
 * @access public
 */
export const getNewAccessToken = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Get cookies
  const cookies = req.cookies

  if (!cookies?.token) {
    return res.status(403).json({
      message: 'Not Authorized'
    })
  }

  // Get refresh token
  const token = cookies.token

  try {
    // Get target user with refresh token
    const targetUser = await User.findOne({ refreshToken: token })

    if (!targetUser) {
      return res.status(401).json({
        message: 'User does not exist. Unauthenticated Token'
      })
    }

    // Get refresh token secret
    const refreshTokenSecret: any = process.env.REFRESH_TOKEN_SECRET
    const accessTokenSecret: any = process.env.ACCESS_TOKEN_SECRET

    jwt.verify(token, refreshTokenSecret, (err: any, decoded: any) => {
      if (err ?? decoded.id !== targetUser._id) {
        return res.status(403).json({
          message: 'Unauthenticated User'
        })
      }

      // Token payload
      const tokenPayload = {
        id: targetUser._id,
        companyId: targetUser.companyId,
        isAdmin: targetUser.admin
      }

      // Get new access token
      const accessToken = jwt.sign(tokenPayload, accessTokenSecret, {
        expiresIn: '15m'
      })

      return res.status(200).json({
        accessToken
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}
