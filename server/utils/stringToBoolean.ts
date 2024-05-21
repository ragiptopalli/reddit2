export function stringToBoolean(value?: string | number | null) {
  if (!value || value === '0' || value === 0) return false;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'false') return false;
    if (value.toLowerCase() === 'off') return false;
    if (value.toLowerCase() === 'disable') return false;
    if (value.toLowerCase() === 'disabled') return false;
  }
  return true;
}
