export default function unixValueToTimestamp(unixTimestamp) {
  if (unixTimestamp === null || unixTimestamp === undefined) return null;
  const seconds = Number(unixTimestamp);
  if (Number.isNaN(seconds)) return null;
  return new Date(seconds * 1000);
}
