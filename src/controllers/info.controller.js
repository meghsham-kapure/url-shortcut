import HTTP_STATUS from '../utils/httpStatus.util.js';

export async function helthcheckController(req, res) {
  return res.status(HTTP_STATUS.OK).json({
    success: 'true',
    message: 'Request Processed Successfully!',
  });
}
