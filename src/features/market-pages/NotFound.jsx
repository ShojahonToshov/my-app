"use client";
import React from "react";
import { ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#ECECEA] font-sans selection:bg-[#8A2532] selection:text-white text-[#121415]">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#8A2532]/10 text-[#8A2532] flex items-center justify-center mb-8">
          <SearchX className="w-8 h-8" />
        </div>

        <h1 className="text-7xl md:text-8xl font-semibold text-[#121415] tracking-tight mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#121415] tracking-tight mb-4">
          Страница не найдена
        </h2>
        <p className="text-[#4A4E51] font-medium leading-relaxed max-w-sm mb-10">
          Возможно, адрес был введен неверно, или страница была перемещена
          либо удалена.
        </p>

        <Link
          href="/"
          className="outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full"
        >
          <Button variant="primary" size="md" icon={ArrowLeft}>
            На главную
          </Button>
        </Link>
      </main>
    </div>
  );
}