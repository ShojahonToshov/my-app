import React from 'react';

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#DCDCDA]/60 rounded-md ${className || ''}`} />;
}
