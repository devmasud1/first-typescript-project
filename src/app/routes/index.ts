import { Router } from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { StudentRoutes } from '../modules/students/student.route'
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },

  {
    path: '/academic-semester',
    route: AcademicSemesterRoutes,
  },
]

// router.use('/user', UserRoutes)
// router.use('/students', StudentRoutes)
moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router
