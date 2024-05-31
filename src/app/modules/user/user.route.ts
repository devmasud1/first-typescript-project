import express from 'express'
import { UserController } from './user.controller'
import createStudentValidationSchema from '../students/student.validation'
import validateRequest from '../../middleware/validateRequest'

const router = express.Router()

router.post(
  '/create-student',
  validateRequest(createStudentValidationSchema),
  UserController.createStudent,
)

export const UserRoutes = router
