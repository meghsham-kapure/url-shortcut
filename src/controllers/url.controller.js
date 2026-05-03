import { validate } from '../middlewares/validate.middleware.js';
import getTimestamp from '../utils/getTimestamp.util.js';
import HTTP_STATUS from '../utils/httpStatus.util.js';
import { createShortcutRequestSchema } from '../validations/url.validations.js';
import { createUrl, findUrlsByIdAndUrl, findUrlsByUserId } from './../services/url.service.js';
import getNanoId from './../utils/getNanoId.util.js';

export async function createShortcut(req, res) {
  console.info(
    `${getTimestamp()} ${req.user.email} sends shortenUrl request received with body: ${JSON.stringify(req.body)}`
  );

  const reqBody = req.validated.body;

  if (!reqBody) {
    return res.status(400).json({
      success: false,
      error: '',
    });
  }

  const userId = req.user.id;
  const { targetUrl } = reqBody;

  const matchingUserUrls = await findUrlsByIdAndUrl(userId, targetUrl);

  if (matchingUserUrls.length > 0) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: 'url already present with user' });
  }

  const shortcut = getNanoId();

  const urlRecord = {
    shortcut,
    targetUrl,
    ownerId: userId,
  };

  const newUrl = await createUrl(urlRecord);

  if (!newUrl) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: 'Could not add the recoded' });
  }

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse({
      statusCode: HTTP_STATUS.OK,
      message: 'URL shortcut created.',
      data: targetUrl,
    })
  );
}

// complete its implementation

// export async function getAllUsersUrls(req, res) {
//   console.info(`${getTimestamp()} ${req.user.email} requests all associated URLs`);

//   const userId = req.user.id;

//   const matchingUserUrls = await findUrlsByUserId(userId);

//   if (matchingUserUrls.length > 0) {
//     return res
//       .status(HTTP_STATUS.BAD_REQUEST)
//       .json({ success: false, error: 'url already present with user' });
//   }
// }

// export async function redirectToOriginalUrl(req, res) {}
