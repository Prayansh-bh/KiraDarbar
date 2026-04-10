import Link from "next/link";
import { ArrowLeft, SearchX, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 font-dm-sans selection:bg-[#E8602A]/20">
      <div className="max-w-xl w-full bg-white border border-gray-100 shadow-xl rounded-2xl p-12 text-center relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8602A]/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-100 rounded-full -ml-16 -mb-16 blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
             <ShieldAlert className="w-10 h-10 text-gray-400" />
          </div>
          
          <h1 className="text-4xl font-bold font-syne text-[#0F0F0F] mb-4">404 - Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-sm text-lg">
            This legal document or page doesn't exist in our registry.
          </p>
          
          <Link href="/">
            <Button className="h-12 px-8 bg-[#111] hover:bg-[#333] text-white rounded font-bold transition-all shadow-lg hover:-translate-y-1">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
