import React from "react";
import { Outfit } from "next/font/google";

const customFont = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

export default function DesignAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex flex-col h-screen overflow-hidden relative font-sans " + customFont.className}>
      <div className="flex-1 h-full">
        {children}
      </div>
    </div>
  );
}
