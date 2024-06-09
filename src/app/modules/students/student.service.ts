import mongoose from 'mongoose'
import { Student } from './student.model'
import AppError from '../../error/appError'
import httpStatus from 'http-status'
import { User } from '../user/user.model'
import { TStudent } from './student.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { studentSearchAbleField } from './student.constant'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // //{email : {$regex: query.search, $option: i}}
  // const queryObj = { ...query } //copy
  // const studentSearchAbleField = ['email', 'name.firstName', 'presentAddress']
  // let searchTerm = ''
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string
  // }
  // const searchQuery = Student.find({
  //   $or: studentSearchAbleField.map(field => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // })
  // //filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']
  // excludeFields.forEach(ele => delete queryObj[ele])
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   })
  // //sort
  // let sort = '-createdAt'
  // if (query?.sort) {
  //   sort = query?.sort as string
  // }
  // const sortQuery = filterQuery.sort(sort)
  // //limit
  // let limit = 1
  // if (query?.limit) {
  //   limit = query?.limit as number
  // }
  // //page
  // let page = 1
  // let skip = 0
  // if (query?.page) {
  //   page = query?.page as number
  //   skip = (page - 1) * limit
  // }
  // const paginateQuery = sortQuery.skip(skip)
  // const limitQuery = paginateQuery?.limit(limit)
  // //fields limiting
  // let fields = '__v'
  // if (query?.fields) {
  //   fields = (query?.fields as string).split(',').join(' ')
  // }
  // const fieldsQuery = await limitQuery.select(fields)
  // return fieldsQuery

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchAbleField)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await studentQuery.modelQuery

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
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  updateStudentsIntoDB,
  deleteStudentsFromDB,
}
