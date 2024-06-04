import express from 'express'
import { AcademicSemesterController } from './academicSemester.controller'
import validateRequest from '../../middleware/validateRequest'
import { AcademicSemesterValidation } from './academicSemester.validation'

const router = express.Router()

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
)

router.get('/:semesterId', AcademicSemesterController.getSingleAcademicSemester)

router.patch(
  '/:semesterId',
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.updateAcademicSemesters,
)

router.get('/', AcademicSemesterController.getAllAcademicSemesters)

export const AcademicSemesterRoutes = router
