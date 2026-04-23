import { createHmac, randomBytes } from 'node:crypto';

const createSaltedPassword = (password, salt) => {
  if (!salt) salt = randomBytes(32).toString('base64');
  const hashedPassword = createHmac('sha256', salt).update(password).digest('base64');
  return { hashedPassword, salt };
};

export { createSaltedPassword };
