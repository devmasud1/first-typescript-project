import { Schema, model } from 'mongoose'
import { TAcademicDepartment } from './academicDepartment.interface'
import AppError from '../../error/appError'
import httpStatus from 'http-status'

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
  },
})

// academicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExist = await AcademicDepartment.findOne({
//     name: this.name,
//   })

//   if (isDepartmentExist) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       'This department is already exist!',
//     )
//   }

//   next()
// })

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery()

  const isDepartmentExist = await this.model.findOne(query)

  if (!isDepartmentExist) {
    const error = new AppError(
      httpStatus.NOT_FOUND,
      'This department does not exist!',
    )
    return next(error)
  }

  next()
})

export const AcademicDepartment = model(
  'AcademicDepartment',
  academicDepartmentSchema,
)
