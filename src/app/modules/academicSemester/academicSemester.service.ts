import httpStatus from 'http-status'
import AppError from '../../error/appError'
import { AcademicSemesterNameAndCodeMapper } from './academicSemester.constant'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (AcademicSemesterNameAndCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid semester code!')
  }

  const result = await AcademicSemester.create(payload)
  return result
}
const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemester.find()
  return result
}
const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id)

  if (!result) {
    throw new AppError(404, 'This semester does not exist!')
  }

  return result
}
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    AcademicSemesterNameAndCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid semester code!')
  }

  const result = await AcademicSemester.findByIdAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  )

  return result
}

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
}
