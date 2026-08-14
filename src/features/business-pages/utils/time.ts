export const calculateETA = (timeStr: string, delayMinutes = 0): string => {
  if (!timeStr) return "--:--";
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h || 0, (m || 0) + delayMinutes);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
