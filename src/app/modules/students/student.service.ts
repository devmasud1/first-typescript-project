import mongoose from 'mongoose'
import { Student } from './student.model'
import AppError from '../../error/appError'
import httpStatus from 'http-status'
import { User } from '../user/user.model'
import { TStudent } from './student.interface'

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
  return result
}
const getSingleStudentsFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This student does not exist!')
  }

  return result
}

const updateStudentsIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardians, localGuardian, ...remainingStudentData } = payload

  const modifiedUpdatedData: Record<string, unknown> = {}

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }
  if (guardians && Object.keys(guardians).length) {
    for (const [key, value] of Object.entries(guardians)) {
      modifiedUpdatedData[`guardians.${key}`] = value
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This student does not exists!')
  }
  return result
}

const deleteStudentsFromDB = async (id: string) => {
  const deletedID = await Student.findOne({ id })

  if (!deletedID) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user does not exist!')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDelete: true },
      { new: true, session },
    )

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!')
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDelete: true },
      { new: true, session },
    )

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!')
    }

    await session.commitTransaction()
    await session.endSession()

    return deletedStudent
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('Failed to delete student')
  }
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  updateStudentsIntoDB,
  deleteStudentsFromDB,
}
