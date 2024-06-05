import httpStatus from 'http-status'
import AppError from '../../error/appError'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'

const createAcademicDepartmentFromDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload)
  return result
}

const getAllAcademicDepartmentFromDB = async () => {
  const result = await AcademicDepartment.find().populate('academicFaculty')
  return result
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty')

  if (!result) {
    throw new AppError(404, 'This department does not exist!')
  }

  return result
}

const updateAcademicDepartmentIntoFB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true },
  )

  return result
}

export const AcademicDepartmentServices = {
  createAcademicDepartmentFromDB,
  getAllAcademicDepartmentFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoFB,
}
