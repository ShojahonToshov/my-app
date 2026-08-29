import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Elara",
    default: "Elara",
  },
  description: "Elara",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html
      data-scroll-behavior="smooth"
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'white',
              color: '#121415',
              border: '1px solid #DCDCDA',
              borderRadius: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '16px',
            },
            className: 'font-sans text-[14px] font-medium tracking-tight',
            classNames: {
              success: 'text-[#121415] border-[#DCDCDA] bg-white',
              error: 'text-[#dc2626] border-[#fecaca] bg-white',
              warning: 'text-[#d97706] border-[#fde68a] bg-white',
              info: 'text-[#121415] border-[#DCDCDA] bg-[#F5F5F4]',
            }
          }}
        />
      </body>
    </html>
  );
}
