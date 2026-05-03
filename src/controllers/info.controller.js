import HTTP_STATUS from '../utils/httpStatus.util.js';
import ApiResponse from './../core/ApiResponse.js';

export async function helthcheckController(req, res) {
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      statusCode: HTTP_STATUS.OK,
      message: 'Request Processed Successfully!',
    })
  );
}
