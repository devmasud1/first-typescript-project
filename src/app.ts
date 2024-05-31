import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middleware/global.errorHandler'
import notFound from './app/middleware/notFound'
import router from './app/routes'
import sendResponse from './app/utils/sendResponse'
import httpStatus from 'http-status'

const app: Application = express()

//parser
app.use(express.json())
app.use(cors())

app.use('/api/v1', router)

//default-routes
const defaultRoutes = (req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'website is running',
    data: 'welcome to pH University',
  })
}
app.get('/', defaultRoutes)

app.use(notFound)
app.use(globalErrorHandler)

export default app
