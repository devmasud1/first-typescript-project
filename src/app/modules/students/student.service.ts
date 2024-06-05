import { Student } from './student.model'

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
  return result
}

const deleteStudentsFromDB = async (id: string) => {
  const result = await Student.updateOne({ id: id }, { isDelete: true })
  return result
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  deleteStudentsFromDB,
}
