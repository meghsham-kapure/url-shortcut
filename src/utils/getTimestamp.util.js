export default function getTimestamp() {
  return `[${new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata', hour12: false }).replace(',', '')}:${String(new Date().getMilliseconds()).padStart(3, '0')}]`;
}
