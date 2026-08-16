import React from "react";

// ─── Palette ─────────────────────────────────────────────────────────────────
// Each entry: [bg, text] in Tailwind inline-style hex values.
// Chosen to match Elara's refined, muted palette.
const PALETTE: [string, string][] = [
  ["#D4E4F7", "#1A4A7A"], // muted blue
  ["#D7EDD9", "#2D6A35"], // muted green
  ["#EDD9F0", "#6A2D7A"], // muted purple
  ["#F0E2D0", "#7A4A1A"], // muted amber
  ["#D9EDE8", "#2D6A5A"], // muted teal
  ["#F0D9D9", "#7A2D2D"], // muted rose (brand-adjacent)
  ["#DDE0F0", "#2D3A7A"], // muted indigo
  ["#F0EBD9", "#7A6A2D"], // muted gold
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate 0–7 color index deterministically from a string */
function hashIndex(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0; // unsigned 32-bit
  }
  return h % PALETTE.length;
}

/** Extract up to 2 initials from a display name */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Size map ─────────────────────────────────────────────────────────────────
const SIZE: Record<string, { px: number; text: string; ring: string }> = {
  xs: { px: 28,  text: "text-[10px] font-bold",  ring: "ring-2"  },
  sm: { px: 32,  text: "text-xs font-bold",       ring: "ring-2"  },
  md: { px: 40,  text: "text-sm font-semibold",   ring: "ring-2"  },
  ml: { px: 44,  text: "text-base font-semibold", ring: "ring-2"  },
  lg: { px: 56,  text: "text-lg font-semibold",   ring: "ring-2"  },
  xl: { px: 80,  text: "text-2xl font-semibold",  ring: "ring-[3px]" },
  "2xl": { px: 112, text: "text-4xl font-semibold", ring: "ring-[3px]" },
};

// ─── Props ────────────────────────────────────────────────────────────────────
export interface AvatarProps {
  /** Display name used to generate initials & color */
  name?: string | null;
  /** If provided and non-empty, shows a real photo */
  src?: string | null;
  size?: keyof typeof SIZE;
  className?: string;
  /** Show a white ring border */
  ring?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Avatar({
  name,
  src,
  size = "md",
  className = "",
  ring = false,
}: AvatarProps) {
  const displayName = name?.trim() || "?";
  const initials    = getInitials(displayName);
  const { px, text, ring: ringCls } = SIZE[size] ?? SIZE["md"];
  
  // Default deterministic colors
  let [bg, fg] = PALETTE[hashIndex(displayName)];
  let customBorder = "";

  // Check if src is actually a color definition
  let isColorSrc = false;
  if (src && src.startsWith("colors:")) {
    isColorSrc = true;
    const parts = src.replace("colors:", "").split(",");
    if (parts[0]) bg = parts[0];
    if (parts[1]) fg = parts[1];
    if (parts[2]) customBorder = parts[2];
  }

  // If there's a custom border, we apply a box-shadow (ring) manually so it doesn't conflict with ring-white
  const ringStyle = customBorder ? { boxShadow: `0 0 0 2px ${customBorder}` } : {};
  
  // If we have a custom border, we don't want the default ring-white class to interfere
  const ringClassStr = (ring && !customBorder) ? `${ringCls} ring-white` : "";
  
  const base = `shrink-0 rounded-full flex items-center justify-center select-none overflow-hidden transition-transform duration-200 ${ringClassStr} ${className}`;

  if (src && !isColorSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={displayName}
        width={px}
        height={px}
        className={`${base} object-cover`}
        style={{ width: px, height: px, ...ringStyle }}
      />
    );
  }

  return (
    <div
      className={`${base} ${text}`}
      style={{ width: px, height: px, backgroundColor: bg, color: fg, ...ringStyle }}
      aria-label={`Avatar: ${displayName}`}
      role="img"
    >
      {initials}
    </div>
  );
}
