import getEnvironment from './getEnvironment.util.js';

const cookieOptionsProd = {
  secure: true,
  httpOnly: true,
  sameSite: 'Strict',
};

const cookieOptionsDev = {
  secure: false,
  httpOnly: true,
  sameSite: 'Lax',
};

export default function getCookiesOptions() {
  const env = getEnvironment();
  if (env.toLocaleLowerCase().startsWith('dev')) return cookieOptionsDev;
  else if (env.toLocaleLowerCase().startsWith('prod')) return cookieOptionsProd;
  else return {};
}
