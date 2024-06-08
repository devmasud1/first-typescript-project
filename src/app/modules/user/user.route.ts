import express from 'express'
import { UserController } from './user.controller'

import validateRequest from '../../middleware/validateRequest'
import { studentValidation } from '../students/student.validation'

const router = express.Router()

router.post(
  '/create-student',
  validateRequest(studentValidation.createStudentValidationSchema),
  UserController.createStudent,
)

export const UserRoutes = router
