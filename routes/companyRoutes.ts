/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  createCompany,
  getCompanyById,
  updateCompanyById,
  getUsersByCompanyId,
  createCompanyUser,
  updateUserById,
  deleteUserById
} from '../controllers/companyControllers'
import { verifyJWT } from '../middlewares/verifyJWT'
const router = express.Router()

// Create company
router.post('/', createCompany)

// Get, and update company by id
router
  .route('/:companyId')
  .get(verifyJWT, getCompanyById)
  .put(verifyJWT, updateCompanyById)

// Get company users by company id
router.get('/users/:companyId', verifyJWT, getUsersByCompanyId)

// Create new user for a company
router.post('/createUser/:companyId', verifyJWT, createCompanyUser)

// Update and Delete company user by user id
router
  .route('/user/:userId')
  .put(verifyJWT, updateUserById)
  .delete(verifyJWT, deleteUserById)

// Update user password

export default router
