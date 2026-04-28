import HTTP_STATUS from '../utils/httpStatus.util.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.validated = parsed;

    next();
  } catch (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation Failed',
      errors: error.format(),
    });
  }
};
