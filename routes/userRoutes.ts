/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  getNewAccessToken,
  signIn,
  signOut
} from '../controllers/userController'
const router = express.Router()

// Sign in user
router.post('/signIn', signIn)

// Sign out user
router.post('/signOut', signOut)

// Handle refresh token
router.get('/refreshToken', getNewAccessToken)

export default router
