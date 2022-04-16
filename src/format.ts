export function timestampToTimestring(timestamp: number) {
  const date = new Date(timestamp);
  const hh = prependZeroToNumber(date.getHours());
  const mm = prependZeroToNumber(date.getMinutes());
  const ss = prependZeroToNumber(date.getSeconds());

  return `${hh}:${mm}:${ss}`;
}

function prependZeroToNumber(num: number): string {
  return num >= 10 ? `${num}` : `0${num}`;
}
