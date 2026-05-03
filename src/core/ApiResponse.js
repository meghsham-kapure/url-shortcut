class ApiResponse {
  constructor({ statusCode = 200, message = 'Success', data = null }) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
