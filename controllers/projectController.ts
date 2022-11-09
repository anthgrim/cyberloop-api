/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import Project from '../models/projectModel'
import { SpecialRequest } from '../types'
import { Response } from 'express'

/**
 * @desc   Create a new project with company id
 * @route  /api/project/
 * @method POST
 * @access private
 */
export const createProject = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Only admins can create new project
  const isAdminRequest = req.isAdmin

  if (!isAdminRequest) {
    return res.status(401).json({
      message: 'Not enough permissions to perform this action'
    })
  }

  // Get company id from request
  const companyId = req.companyId

  if (!companyId) {
    return res.status(400).json({
      message: 'Missing company id'
    })
  }

  // Get fields from request
  const { title, description } = req.body

  if (!title || !description) {
    return res.status(400).json({
      message: 'Missing required fields'
    })
  }

  try {
    // Create new project
    const newProject = await Project.create({
      companyId,
      title,
      description
    })

    return res.status(200).json({
      message: `Project ${newProject.title} created successfully`,
      project: newProject
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
 * @desc   Get list of projects by company
 * @route  /api/project/company
 * @method GET
 * @access Private
 */
export const getListOfProjects = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Get company id from request
  const companyId = req.companyId

  if (!companyId) {
    return res.status(400).json({
      message: 'Missing company id'
    })
  }

  try {
    // Get list of projects with company id
    const projects = await Project.find({ companyId }).lean()

    return res.status(200).json({
      projects
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
 * @desc   Get project by id
 * @route  /api/project/:projectId
 * @method GET
 * @access Private
 */
export const getProjectById = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  const { projectId } = req.params

  if (!projectId) {
    return res.status(400).json({
      message: 'Missing project id'
    })
  }

  try {
    // Get target project
    const targetProject = await Project.findById(projectId)

    if (!targetProject) {
      return res.status(404).json({
        message: 'Project does not exist'
      })
    }

    return res.status(200).json({
      project: targetProject
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
 * @desc   Update project by id
 * @route  /api/project/:projectId
 * @method PUT
 * @access Private
 */
export const updateProjectById = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Only admins can update a project
  const isAdminRequest = req.isAdmin

  if (!isAdminRequest) {
    return res.status(401).json({
      message: 'Not enough permissions to perform this action'
    })
  }

  // Get project id from params
  const { projectId } = req.params

  if (!projectId) {
    return res.status(400).json({
      message: 'Missing project id'
    })
  }

  // Get fields from request
  const { title, description } = req.body

  if (!title || !description) {
    return res.status(400).json({
      message: 'Missing required fields'
    })
  }

  try {
    // Get target project
    const targetProject = await Project.findById(projectId)

    if (!targetProject) {
      return res.status(404).json({
        message: 'Project does not exist'
      })
    }

    // Perform update
    targetProject.title = title
    targetProject.description = description
    await targetProject.save()

    return res.status(200).json({
      message: 'Project updated successfully'
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
 * @desc   Delete project by id
 * @route  /api/project/:projectId
 * @method DELETE
 * @access Private
 */
export const deleteProjectById = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Only admins can delete a project
  const isAdminRequest = req.isAdmin

  if (!isAdminRequest) {
    return res.status(401).json({
      message: 'Not enough permissions to perform this action'
    })
  }

  // Get project id from params
  const { projectId } = req.params

  if (!projectId) {
    return res.status(400).json({
      message: 'Missing project id'
    })
  }

  try {
    // Delete target project
    const targetProject = await Project.findByIdAndDelete(projectId)

    if (!targetProject) {
      return res.status(404).json({
        message: 'Project does not exist'
      })
    }

    return res.status(200).json({
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}
