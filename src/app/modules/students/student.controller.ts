import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully',
    data: result,
  })
})

const getSingleStudents = catchAsync(async (req, res) => {
  const { studentId } = req.params
  const result = await StudentServices.getSingleStudentsFromDB(studentId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Student retrieved successfully',
    data: result,
  })
})

const updateStudents = catchAsync(async (req, res) => {
  const { studentId } = req.params
  const { student } = req.body
  const result = await StudentServices.updateStudentsIntoDB(studentId, student)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data updated successfully!',
    data: result,
  })
})

const deleteStudents = catchAsync(async (req, res) => {
  const { studentId } = req.params
  const result = await StudentServices.deleteStudentsFromDB(studentId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student delete successfully',
    data: result,
  })
})

export const StudentController = {
  getAllStudents,
  getSingleStudents,
  updateStudents,
  deleteStudents,
}
