import { AxiosError } from 'axios'

/**
 * Get a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const data = error.response?.data

    if (data?.error?.message) {
      return data.error.message
    }
    if (data?.message) {
      return data.message
    }

    // Backend inconsistently sends CORS headers on failed responses, so this is sometimes as specific as we can get
    if (!error.response) {
      return 'Connection failed. This could be a network issue, CORS problem, or authentication error. Check your API key and network connection.'
    }

    if (status === 401 || status === 403) {
      return 'Authentication failed. Please check your API credentials.'
    }
    if (status === 404) {
      return 'Resource not found.'
    }
    if (status && status >= 500) {
      return 'Service error. Please try again later.'
    }

    return `Request failed with status ${status}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}
