"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('case_id');
  const [loading, setLoading] = useState(true);
  const [tenantPhone, setTenantPhone] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      if (!caseId) {
        return router.push('/dashboard');
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data } = await supabase.from('users').select('phone').eq('id', user.id).single();
      setTenantPhone(data?.phone || 'your registered number');
      setLoading(false);
    }
    verify();
  }, [caseId, router]);

  if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-sm text-gray-500">Verifying session...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-dm-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-black/5 p-8 md:p-12 text-center border border-gray-100">
        
        {/* Animated Checkmark */}
        <div className="mb-8 flex justify-center">
          <motion.svg
            className="w-24 h-24 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
              }}
            />
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4"
              variants={{
                hidden: { pathLength: 0 },
                visible: { pathLength: 1, transition: { delay: 0.5, duration: 0.4, ease: "easeOut" } }
              }}
            />
          </motion.svg>
        </div>

        <motion.h1 
          className="text-3xl font-bold font-syne text-[#0F0F0F] mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Checkout Successful
        </motion.h1>
        
        <motion.div
           className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6"
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 1 }}
        >
          <p className="text-xs font-bold text-green-800 uppercase tracking-widest mb-1">Receipt Reference</p>
          <p className="font-mono text-xl font-bold text-green-900">KD-{caseId?.split('-')[0].toUpperCase()}</p>
        </motion.div>

        <motion.p 
          className="text-gray-600 leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Your case has been securely filed. Our legal team will review your submitted evidence within 24 hours. A designated paralegal will contact you directly at <strong className="font-mono text-gray-800">{tenantPhone}</strong> for next steps.
        </motion.p>

        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Link href={`/dashboard/cases/${caseId}`} className="block">
            <Button className="w-full bg-[#E8602A] hover:bg-[#D4501D] text-white font-bold h-12 text-lg shadow-md">
              View My Case <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href={`/dashboard`} className="block">
            <Button variant="outline" className="w-full h-12 font-bold text-gray-600 hover:text-[#0F0F0F] hover:bg-gray-50 border-gray-200">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go to Dashboard
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-sm text-gray-500">Loading receipt...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
