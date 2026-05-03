import ApiResponse from '../core/ApiResponse';
import HTTP_STATUS from './httpStatus.util';
export default function getResponseForUnimplementedApi(req, res) {
  return res
    .status(HTTP_STATUS.NOT_IMPLEMENTED)
    .json(new ApiResponse({ statusCode: 501, message: 'Not Implemented', request: res }));
}
