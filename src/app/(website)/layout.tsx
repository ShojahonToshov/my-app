import React from "react";
import { Outfit } from "next/font/google";

const customFont = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
import { WebsiteHeader } from "@/components/WebsiteHeader";
import { WebsiteFooter } from "@/components/WebsiteFooter";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex flex-col min-h-screen relative font-sans " + customFont.className}>
      <WebsiteHeader />
      <div className="flex-1">
        {children}
      </div>
      <WebsiteFooter />
    </div>
  );
}

