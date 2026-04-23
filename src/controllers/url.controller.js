import HTTP_STATUS from '../utils/httpStatus.util.js';

export async function shortenUrl(req, res) {
  return res.send(req.user);
}
