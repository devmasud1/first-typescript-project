import config from '../../config'
import { TAcademicSemester } from '../academicSemester/academicSemester.interface'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TStudent } from '../students/student.interface'
import { Student } from '../students/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'
import { generateStudentId } from './user.utils'

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

  // check if admissionSemester is found
  if (!admissionSemester) {
    throw new Error('Admission semester not found')
  }

  // set generated id
  userData.id = await generateStudentId(admissionSemester)

  //create a user
  const newUser = await User.create(userData)

  //create a student
  if (Object.keys(newUser).length) {
    //set id, _id as user
    payload.id = newUser.id
    payload.user = newUser._id //reference_id

    const newStudent = await Student.create(payload)
    return newStudent
  }

  return newUser
}

export const UserService = {
  createStudentIntoDB,
}
