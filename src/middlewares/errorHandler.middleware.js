import getEnvironment from '../utils/getEnvironment.util.js';
import ApiError from './../core/ApiError.js';
import HTTP_STATUS from './../utils/httpStatus.util.js';
const errorHandler = (err, req, res, next) => {
  const env = getEnvironment();

  const statusCode = err.statusCode || 500;

  if (env === 'development') {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(new ApiError({ statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,  }));
  } else {
    return res.status(statusCode).json({
      success: false,
      hint: err.hint || ' Error : Something went wrong',
    });
  }
};

export default errorHandler;
