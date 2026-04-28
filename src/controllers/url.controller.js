import getTimestamp from '../utils/getTimestamp.util.js';
import HTTP_STATUS from '../utils/httpStatus.util.js';
import { shortenUrlRequestSchema } from '../validations/url.validations.js';
import { createUrl, findUrlsByIdAndUrl, findUrlsByUserId } from './../services/url.service.js';
import getNanoId from './../utils/getNanoId.util.js';

export async function shortenUrl(req, res) {
  console.info(
    `${getTimestamp()} ${req.user.email} sends shortenUrl request received with body: ${JSON.stringify(req.body)}`
  );

  const validatedUrl = shortenUrlRequestSchema.safeParse(req.body);

  if (validatedUrl.error) {
    return res.status(400).json({
      success: false,
      error: validatedUrl.error.format(),
    });
  }

  const userId = req.user.id;
  const { targetUrl } = validatedUrl.data;

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
    return res.send('NOT CREATED');
  }

  return res.status(201).json({ success: true, targetUrl });
}

export async function getAllUsersUrls(req, res) {
  console.info(`${getTimestamp()} ${req.user.email} requests all associated URLs`);

  const userId = req.user.id;

  const matchingUserUrls = await findUrlsByUserId(userId);

  if (matchingUserUrls.length > 0) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: 'url already present with user' });
  }
}
