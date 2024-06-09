import express from 'express'
import { UserController } from './user.controller'

import validateRequest from '../../middleware/validateRequest'
import { studentValidation } from '../students/student.validation'
import { createFacultyValidationSchema } from '../faculty/faculty.validation'

const router = express.Router()

router.post(
  '/create-student',
  validateRequest(studentValidation.createStudentValidationSchema),
  UserController.createStudent,
)
router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
)

export const UserRoutes = router
