/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  createProject,
  deleteProjectById,
  getListOfProjects,
  getProjectById,
  updateProjectById
} from '../controllers/projectController'
import { verifyJWT } from '../middlewares/verifyJWT'
const router = express.Router()

// Create a new project for company
router.post('/', verifyJWT, createProject)

// Get, update and delete project by id
router
  .route('/:projectId')
  .get(verifyJWT, getProjectById)
  .put(verifyJWT, updateProjectById)
  .delete(verifyJWT, deleteProjectById)

// Get list of projects by company id
router.get('/company', verifyJWT, getListOfProjects)

export default router
