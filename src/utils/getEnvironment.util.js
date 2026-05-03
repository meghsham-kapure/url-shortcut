export default function getEnvironment() {
  return process.env.ENVIRONMENT?.toLowerCase() || 'development';
}
