import config from '../../config'
import { TStudent } from '../students/student.interface'
import { Student } from '../students/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //create a user obj
  const userData: Partial<TUser> = {}

  //if password is not given, use default password
  userData.password = password || (config.default_password as string)

  //set user role
  userData.role = 'student'

  //set manually id
  userData.id = '2030100001'

  //create a user
  const newUser = await User.create(userData)

  //create a student
  if (Object.keys(newUser).length) {
    //set id, _id as user
    studentData.id = newUser.id
    studentData.user = newUser._id //reference_id

    const newStudent = await Student.create(studentData)
    return newStudent
  }

  return newUser
}

export const UserService = {
  createStudentIntoDB,
}
