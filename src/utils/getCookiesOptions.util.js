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
  const env = process.env.ENVIRONMENT?.toLowerCase() || 'development';

  if (env.toLocaleLowerCase().startsWith('dev')) return cookieOptionsDev;
  else if (env.toLocaleLowerCase().startsWith('prod')) return cookieOptionsProd;
  else return {};
}
