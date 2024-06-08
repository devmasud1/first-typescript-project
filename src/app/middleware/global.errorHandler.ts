import { ErrorRequestHandler } from 'express'
import { ZodError, ZodIssue } from 'zod'
import { TErrorSources } from '../interface/error'
import config from '../config'
import handleZodError from '../error/handleZodError'
import handleValidationError from '../error/handleValidationError'
import handleCastError from '../error/handleCastError'
import handleDuplicateId from '../error/handleDuplicateId'
import AppError from '../error/appError'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default value
  let statusCode = 500
  let message = 'something went wrong!'

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'something went wrong!',
    },
  ]

  //error
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err)

    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)

    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err)

    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateId(err)

    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err instanceof AppError) {
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  } else if (err instanceof Error) {
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  })
}

export default globalErrorHandler
