"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We would theoretically log to Sentry here
    console.error("Global captured error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6 font-dm-sans text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold font-syne tracking-tight">Something went wrong.</h1>
        <p className="text-gray-400">
          We've encountered an unexpected error linking to our legal nodes. Our team has been notified.
        </p>
        
        <div className="bg-[#1A1A1A] p-4 rounded-md text-left overflow-x-auto border border-white/5 whitespace-pre-wrap font-mono text-[10px] text-gray-500">
          {error.message || "Unknown Application Exception"}
          {error.digest && `\nDigest ID: ${error.digest}`}
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={() => reset()}
            className="w-full h-12 bg-[#E8602A] hover:bg-[#D4501D] text-white font-bold"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button variant="ghost" className="w-full h-12 text-gray-400 hover:text-white hover:bg-white/5">
               <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
