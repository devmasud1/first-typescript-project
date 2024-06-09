import config from '../../config'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TStudent } from '../students/student.interface'
import { Student } from '../students/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'
import { generateFacultyId, generateStudentId } from './user.utils'
import AppError from '../../error/appError'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import { TFaculty } from '../faculty/faculty.interface'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { Faculty } from '../faculty/faculty.model'

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user obj
  const userData: Partial<TUser> = {}

  //if password is not given, use default password
  userData.password = password || (config.default_password as string)

  //set user role
  userData.role = 'student'

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  )

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission semester not found!')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set generated id
    userData.id = await generateStudentId(admissionSemester)

    //create a user (transaction-1)
    const newUser = await User.create([userData], { session })

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!')
    }
    //set id, _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference_id

    //create a student (transaction-2)
    const newStudent = await Student.create([payload], { session })

    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student!')
    }

    await session.commitTransaction()
    await session.endSession()
    return newStudent
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()

    throw new Error(err)
  }
}

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {}

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string)

  //set student role
  userData.role = 'faculty'

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  )

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set  generated id
    userData.id = await generateFacultyId()

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }) // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    // set id , _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session })

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
    }

    await session.commitTransaction()
    await session.endSession()

    return newFaculty
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

export const UserService = {
  createStudentIntoDB,
  createFacultyIntoDB,
}
