import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '.otp_cache.json');

export const getOtpCache = () => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading otp cache', e);
  }
  return {};
};

export const saveOtpCache = (cache: any) => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.error('Error writing otp cache', e);
  }
};
