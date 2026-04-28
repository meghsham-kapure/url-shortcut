import { nanoid, customAlphabet } from 'nanoid';

export default function getNanoId() {
  const allowedCharactersInNanoId =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const size = 8;

  const nanoId = customAlphabet(allowedCharactersInNanoId, size);
  const nanoIdValue = nanoId();

  return nanoIdValue;
}
