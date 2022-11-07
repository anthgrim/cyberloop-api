/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import Company from '../models/companyModel'
import User from '../models/userModel'
import bcryp from 'bcrypt'
import { SpecialRequest } from '../types'
import { Response } from 'express'

/**
 * @desc   Create company and admin user
 * @route  /api/company/
 * @method POST
 * @access Public
 */
export const createCompany = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Get fields from request body
  const {
    companyName,
    addressLineOne,
    addressLineTwo,
    city,
    state,
    zipCode,
    email,
    subscriptionId,
    firstName,
    lastName,
    password
  } = req.body

  // Verify required fields
  if (
    !companyName ||
    !addressLineOne ||
    !city ||
    !state ||
    !zipCode ||
    !email ||
    !firstName ||
    !lastName ||
    !password
  ) {
    return res.status(400).json({
      message: 'Missing required fields'
    })
  }

  // Verify subscription id
  if (!subscriptionId) {
    return res.status(400).json({
      message: 'Missing subscription id'
    })
  }

  try {
    // Check if company is already registered
    const isDuplicate = await Company.findOne({ companyName }).exec()

    if (isDuplicate) {
      return res.status(409).json({
        message: 'Company is already registered'
      })
    }

    // Check if there's a user with email address
    const isDuplicateEmail = await User.findOne({ email }).exec()

    if (isDuplicateEmail) {
      return res.status(409).json({
        message: 'Email is already registered'
      })
    }

    // Create company
    const newCompany = await Company.create({
      companyName,
      addressLineOne,
      addressLineTwo,
      city,
      state,
      zipCode,
      billingEmail: email,
      subscriptionId
    })

    if (newCompany) {
      // Hash password
      const hashedPassword = await bcryp.hash(password, 10)

      // Create new user
      const newUser = await User.create({
        companyId: newCompany._id,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        refreshToken: '',
        admin: true
      })

      return res.status(200).json({
        message: 'Successful Sign Up. Please login',
        user: {
          email: newUser.email
        }
      })
    } else {
      return res.status(409).json({
        message: 'Unable to create company'
      })
    }
  } catch (error) {
    console.log('ERROR:', error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}

/**
 * @desc   Get company's information
 * @route  /api/company/:companyId
 * @method GET
 * @access Private
 */
export const getCompanyById = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Get company id from params
  const { companyId } = req.params

  if (!companyId) {
    return res.status(400).json({
      message: 'Missing company id'
    })
  }

  try {
    // Get target company
    const targetCompany = await Company.findById(companyId).exec()

    if (!targetCompany) {
      return res.status(404).json({
        message: 'Company does not exist'
      })
    }

    return res.status(200).json({
      company: {
        id: targetCompany._id,
        name: targetCompany.companyName,
        addressLineOne: targetCompany.addressLineOne,
        addressLineTwo: targetCompany.addressLineTwo,
        city: targetCompany.city,
        state: targetCompany.state,
        zipCode: targetCompany.zipCode,
        billingEmail: targetCompany.billingEmail
      }
    })
  } catch (error) {
    console.log('ERROR:', error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}

/**
 * @desc   Update company by id
 * @route  /api/company/:companyId
 * @method PUT
 * @access Private
 */
export const updateCompanyById = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Validate admin request
  const adminRequest = req.isAdmin

  if (!adminRequest) {
    return res.status(401).json({
      message: 'Not enough rights to complete request'
    })
  }

  // Get company id from params
  const { companyId } = req.params

  if (!companyId) {
    return res.status(400).json({
      message: 'Missing company id'
    })
  }

  // Get fields from request body
  const {
    companyName,
    addressLineOne,
    addressLineTwo,
    city,
    state,
    zipCode,
    billingEmail
  } = req.body

  // Validate required fields
  if (
    !companyName ||
    !addressLineOne ||
    !addressLineTwo ||
    !city ||
    !state ||
    !zipCode ||
    !billingEmail
  ) {
    return res.status(400).json({
      message: 'Missing required fields'
    })
  }

  try {
    // Get target company
    const targetCompany = await Company.findById(companyId).exec()

    if (!targetCompany) {
      return res.status(404).json({
        message: 'Company does not exist'
      })
    }

    // Perform update
    targetCompany.companyName = companyName
    targetCompany.addressLineOne = addressLineOne
    targetCompany.addressLineTwo = addressLineTwo
    targetCompany.city = city
    targetCompany.state = state
    targetCompany.zipCode = zipCode
    targetCompany.billingEmail = billingEmail
    await targetCompany.save()

    return res.status(200).json({
      message: 'Company has been updated successfully'
    })
  } catch (error) {
    console.log('ERROR:', error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}

/**
 * @desc   Get company's users list by company id
 * @route  /api/company/users/:companyId
 * @method GET
 * @access Private
 */
export const getUsersByCompanyId = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Validate admin request
  const adminRequest = req.isAdmin

  if (!adminRequest) {
    return res.status(401).json({
      message: 'Not enough rights to complete request'
    })
  }

  // Get company id from params
  const { companyId } = req.params

  if (!companyId) {
    return res.status(400).json({
      message: 'Missing company id'
    })
  }

  try {
    // Get users list
    const targetUsers = await User.find({ companyId }).lean()

    const users = []

    for (let i = 0; i < targetUsers.length; i++) {
      const companyUser = {
        companyId,
        _id: targetUsers[i]._id,
        firstName: targetUsers[i].firstName,
        lastName: targetUsers[i].lastName,
        email: targetUsers[i].lastName,
        admin: targetUsers[i].admin
      }
      users.push(companyUser)
    }

    return res.status(200).json({
      users
    })
  } catch (error) {
    console.log('ERROR:', error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}

/**
 * @desc   Create a new user for a company
 * @route  /api/company/createUser/:companyId
 * @method POST
 * @access Private
 */
export const createCompanyUser = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Validate admin request
  const adminRequest = req.isAdmin

  if (!adminRequest) {
    return res.status(401).json({
      message: 'Not enough rights to complete request'
    })
  }

  // Get company id from params
  const { companyId } = req.params

  if (!companyId) {
    return res.status(400).json({
      message: 'Missing company id'
    })
  }

  // Get fields from request body
  const { firstName, lastName, email, password, admin } = req.body

  // Verified required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message: 'Missing required fields'
    })
  }

  try {
    // Check if there's a user with email address
    const isDuplicateEmail = await User.findOne({ email }).exec()

    if (isDuplicateEmail) {
      return res.status(409).json({
        message: 'Email is already registered'
      })
    }

    // Hash password
    const hashedPassword = await bcryp.hash(password, 10)

    // Create new user
    const newUser = await User.create({
      companyId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      admin: admin || false,
      refreshToken: ''
    })

    return res.status(200).json({
      message: `${newUser.email} created succussfully`
    })
  } catch (error) {
    console.log('ERROR:', error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}

/**
 * @desc   Update user by user id
 * @route  /api/company/user/:userId
 * @method PUT
 * @access Private
 */
export const updateUserById = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Validate admin request
  const adminRequest = req.isAdmin

  if (!adminRequest) {
    return res.status(401).json({
      message: 'Not enough rights to complete request'
    })
  }

  // Get company id from params
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({
      message: 'Missing company id'
    })
  }

  // Get fields from request body
  const { firstName, lastName, email, admin } = req.body

  // Verified required fields
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      message: 'Missing required fields'
    })
  }

  try {
    // Get target user
    const targetUser = await User.findById(userId).exec()

    if (!targetUser) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    }

    targetUser.firstName = firstName
    targetUser.lastName = lastName
    targetUser.email = email
    targetUser.admin = admin
    await targetUser.save()

    return res.status(200).json({
      message: 'User has been updated'
    })
  } catch (error) {
    console.log('ERROR:', error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}

/**
 * @desc   Delete user by user id
 * @route  /api/company/user/:userId
 * @method DELETE
 * @access Private
 */
export const deleteUserById = async (
  req: SpecialRequest,
  res: Response
): Promise<any> => {
  // Validate admin request
  const adminRequest = req.isAdmin

  if (!adminRequest) {
    return res.status(401).json({
      message: 'Not enough rights to complete request'
    })
  }

  // Get company id from params
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({
      message: 'Missing company id'
    })
  }

  try {
    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId).exec()

    if (!deletedUser) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    }

    return res.status(200).json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.log('ERROR:', error)
    return res.status(500).json({
      message: 'Server Error',
      error
    })
  }
}
