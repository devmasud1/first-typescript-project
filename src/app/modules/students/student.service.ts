import { Student } from './student.model'
import { TStudent } from './student.interface'

// const createStudentIntoDB = async (studentData: TStudent) => {
//   if (await Student.isUserExits(studentData.id)) {
//     throw new Error('user already exists')
//   }

//   const result = await Student.create(studentData) //build in static method

//   // const result = await student.save() //build in instance method
//   return result
// }

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
  return result
}
const getSingleStudentsFromDB = async (id: string) => {
  // const result = await Student.findOne({ id })
  const result = await Student.aggregate([{ $match: { id: id } }])
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
