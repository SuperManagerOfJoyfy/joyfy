import {
  BaseQueryApi,
  FetchBaseQueryError,
  QueryReturnValue,
} from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'

const extractMessage = (data: any, fallback: string): string => {
  if (
    data?.messages &&
    Array.isArray(data.messages) &&
    data.messages[0]?.message
  ) {
    return data.messages[0].message
  }
  if (typeof data?.messages === 'string') {
    return data.messages
  }
  return fallback
}

export const handleErrors = (
  api: BaseQueryApi,
  result: QueryReturnValue<unknown, FetchBaseQueryError>
) => {
  let error = 'Some error occurred'

  if (result.error) {
    switch (result.error.status) {
      case 'FETCH_ERROR':
      case 'PARSING_ERROR':
      case 'CUSTOM_ERROR':
        error = result.error.error
        break

      case 400:
        error = extractMessage(result.error.data, 'Bad Request')
        break

      case 401:
        error = extractMessage(result.error.data, 'Unauthorized')
        break

      case 403:
        error = 'Forbidden Error. No access rights'
        break

      case 404:
        error = 'page not found (404)'
        break

      case 429:
        error = extractMessage(
          result.error.data,
          'More than 5 attempts from one IP-address during 10 seconds'
        )
        break

      case 500:
        error = 'Internal server error'
        break

      default:
        error = JSON.stringify(result.error)
        break
    }
    toast.error(error)
  }
}
