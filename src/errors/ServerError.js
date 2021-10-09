const errorMessages = {
  401: 'Unauthorized',
  403: 'Forbidden',
  400: 'Bad Request',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error'
}

export default class ServerError extends Error {
  constructor(status, message) {
    super(message || errorMessages[status || 500])
    this.status = status || 500
  }
}
