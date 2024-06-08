import { TErrorSources, TGenericErrorResponse } from '../interface/error'

const handleDuplicateId = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/)

  const ExtractedMessage = match && match[1]

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${ExtractedMessage} is already exists!`,
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  }
}

export default handleDuplicateId
