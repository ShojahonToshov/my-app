"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export default function Tooltip({ 
  children, 
  content, 
  disabled = false, 
  position = 'right',
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const offset = 12; // Gap between trigger and tooltip
      
      switch (position) {
        case 'right':
          return { left: rect.right + offset, top: rect.top + rect.height / 2 };
        case 'left':
          return { left: rect.left - offset, top: rect.top + rect.height / 2 };
        case 'top':
          return { left: rect.left + rect.width / 2, top: rect.top - offset };
        case 'bottom':
          return { left: rect.left + rect.width / 2, top: rect.bottom + offset };
        default:
          return { left: rect.right + offset, top: rect.top + rect.height / 2 };
      }
    }
    return { left: 0, top: 0 };
  };

  useEffect(() => {
    if (isVisible && !disabled) {
      setCoords(calculateCoords());
      
      const handleScroll = () => {
        setCoords(calculateCoords());
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [isVisible, disabled, position]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={className}
      >
        {children}
      </div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVisible && !disabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, ...(position === 'right' ? { x: -5 } : position === 'left' ? { x: 5 } : position === 'top' ? { y: 5 } : { y: -5 }) }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, ...(position === 'right' ? { x: -5 } : position === 'left' ? { x: 5 } : position === 'top' ? { y: 5 } : { y: -5 }) }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`fixed z-[9999] px-3 py-1.5 bg-[#121415] text-white text-xs font-medium rounded-lg shadow-lg pointer-events-none whitespace-nowrap`}
              style={{ 
                left: coords.left, 
                top: coords.top,
                transform: position === 'right' || position === 'left' ? 'translateY(-50%)' : 'translateX(-50%)',
                ...(position === 'left' && { transform: 'translate(-100%, -50%)' }),
                ...(position === 'top' && { transform: 'translate(-50%, -100%)' })
              }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
