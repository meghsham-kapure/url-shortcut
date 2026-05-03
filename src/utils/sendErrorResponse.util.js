import ApiError from '../core/ApiError';
import getEnvironment from './getEnvironment.util';

export default function sendErrorResponse(statusCode, clientMessage, error) {
  const env = getEnvironment();

  if (env === 'dev' || env === 'test') {
    new ApiError()
  } else if (env === 'staging' || env === 'production') {
  } else {
    res.send();
  }
}
