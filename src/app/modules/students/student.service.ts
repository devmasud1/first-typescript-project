import mongoose from 'mongoose'
import { Student } from './student.model'
import AppError from '../../error/appError'
import httpStatus from 'http-status'
import { User } from '../user/user.model'

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
  // const result = await Student.aggregate([{ $match: { id: id } }])

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This student does not exist!')
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
  }
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  deleteStudentsFromDB,
}
