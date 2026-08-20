// Для предотвращения потери кэша между разными API роутами при Hot Reloading (HMR) в Next.js
declare global {
  var _otpCache: Record<string, any> | undefined;
}

export const getOtpCache = () => {
  if (!global._otpCache) {
    global._otpCache = {};
  }
  return global._otpCache;
};
