export function ms2minutesecond(ms: number) {
  const second = Math.floor(ms / 1000) % 60;
  const minute = Math.floor(ms / (1000 * 60));
  return `${('0' + (Number.isNaN(minute) ? '0' : minute)).slice(-2)}:${(
    '0' + (Number.isNaN(second) ? '0' : second)
  ).slice(-2)}`;
}
