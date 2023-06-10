export default class ApiError extends Error {
  message: string;
  type: string;
  status: number;
  payload: object;
  constructor({
    message = 'Internal Server Error',
    type = 'INTERNAL_SERVER_ERROR',
    status = 500,
    payload = {},
  } = {}) {
    super(message);
    this.message = message;
    this.type = type;
    this.status = status;
    this.payload = payload;
  }

  toString() {
    return `#ERROR: ${new Date()};${this.type};${this.message};${JSON.stringify(
      this.payload,
    )}`;
  }
}
