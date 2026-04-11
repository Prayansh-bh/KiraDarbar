"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Download, FileText, CheckCircle2, Circle, Clock, MessageSquare, 
  MapPin, Phone, User, FileOutput, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TIMELINE_STEPS = [
  { id: 'submitted', label: "Case Submitted", desc: "We've received your details and documents." },
  { id: 'under_review', label: "Under Review", desc: "A paralegal is actively reviewing your case." },
  { id: 'in_progress', label: "Action in Progress", desc: "Legal notice drafted / review happening." },
  { id: 'resolved', label: "Resolved", desc: "The dispute has been successfully concluded." },
];

import { use } from "react";

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notice, setNotice] = useState<any>(null);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadCase() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const [
        { data: tCase },
        { data: tDocs },
        { data: tNotice }
      ] = await Promise.all([
        supabase.from('cases').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('documents').select('*').eq('case_id', id),
        supabase.from('notices').select('*').eq('case_id', id).maybeSingle()
      ]);

      if (!tCase) {
        router.push("/dashboard/cases");
        return;
      }

      setCaseData(tCase);
      setDocuments(tDocs || []);
      setNotice(tNotice);
      setLoading(false);
    }
    loadCase();
  }, [id, router, supabase]);

  if (loading) {
     return (
       <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
         <div className="h-8 w-24 bg-gray-200 rounded"></div>
         <div className="h-32 bg-gray-200 rounded-xl"></div>
         <div className="grid md:grid-cols-3 gap-8 mt-8">
           <div className="h-[400px] bg-gray-200 rounded-xl"></div>
           <div className="md:col-span-2 h-[400px] bg-gray-200 rounded-xl"></div>
         </div>
       </div>
     );
  }

  const currentStepIndex = TIMELINE_STEPS.findIndex(s => s.id === (caseData.status === 'closed' ? 'resolved' : caseData.status));

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link href="/dashboard/cases" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#0F0F0F] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Cases
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border 
              ${caseData.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-[#E8602A]/10 text-[#E8602A] border-[#E8602A]/20'}`}
            >
              {caseData.status.replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-gray-400">ID: {caseData.id.split('-')[0].toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-bold font-syne text-[#0F0F0F]">{caseData.title}</h1>
          <p className="text-gray-500 mt-1 font-medium">{caseData.case_type.replace('_', ' ')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filed On</p>
          <p className="text-lg font-mono font-bold text-[#0F0F0F]">{new Date(caseData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold font-syne text-[#0F0F0F] mb-8">Live Tracker</h2>
              <div className="relative ml-3 space-y-8">
                {/* Background vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                
                {/* Animated progress line */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute left-[7px] top-2 w-0.5 bg-green-500 origin-top z-10"
                />

                {TIMELINE_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  return (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (idx * 0.2) }}
                      className="relative pl-8 z-20"
                    >
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-colors duration-500 ${
                        isCompleted ? 'border-green-500 bg-green-500' : 'border-gray-200'
                      }`}>
                         {isCompleted && !isActive && (
                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + (idx * 0.2) }}>
                             <CheckCircle2 className="w-3 h-3 text-white" />
                           </motion.div>
                         )}
                         {isActive && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                      </div>
                      <div className={`font-bold transition-colors duration-500 ${isActive ? 'text-[#0F0F0F]' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {step.desc}
                      </div>
                      {isCompleted && idx === 0 && (
                        <div className="text-[10px] font-mono text-gray-400 mt-2">{new Date(caseData.created_at).toLocaleString()}</div>
                      )}
                      {isActive && idx > 0 && (
                        <div className="text-[10px] font-mono text-amber-500 mt-2 inline-flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                          <Clock className="w-3 h-3" /> Updated recently
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-100 shadow-sm">
            <CardContent className="p-6">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                   <MessageSquare className="w-5 h-5 text-blue-600" />
                 </div>
                 <h3 className="font-bold font-syne text-[#0F0F0F]">Need Help?</h3>
               </div>
               <p className="text-sm text-gray-600 mb-4">Chat directly with the paralegal handling your case.</p>
               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">Open Chat</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Details & Docs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
             <CardContent className="p-8">
               <h2 className="text-xl font-bold font-syne text-[#0F0F0F] mb-6">Dispute Evidence</h2>
               
               <div className="bg-gray-50 rounded-xl p-6 mb-8 text-sm leading-relaxed text-gray-700 whitespace-pre-line border border-gray-100">
                 {caseData.description}
               </div>

               <div className="grid sm:grid-cols-2 gap-6 bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-8">
                 <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1"><User className="w-3 h-3" /> Landlord Name</p>
                   <p className="font-bold text-[#0F0F0F]">{caseData.landlord_name || 'N/A'}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1"><Phone className="w-3 h-3" /> Landlord Phone</p>
                   <p className="font-bold text-[#0F0F0F] font-mono">{caseData.landlord_phone || 'N/A'}</p>
                 </div>
                 <div className="sm:col-span-2">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> Property Address</p>
                   <p className="font-medium text-gray-700">{caseData.property_address || 'N/A'}</p>
                 </div>
               </div>

               {caseData.notes && (
                 <div className="mb-8 border-l-4 border-amber-400 pl-4 py-2">
                   <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Paralegal Note</p>
                   <p className="text-sm font-medium text-gray-800">{caseData.notes}</p>
                 </div>
               )}

               <h3 className="text-lg font-bold font-syne text-[#0F0F0F] mb-4">Uploaded Documents</h3>
               {documents.length > 0 ? (
                 <div className="grid sm:grid-cols-2 gap-4">
                   {documents.map((doc) => (
                     <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg group hover:border-[#E8602A] transition-colors">
                       <div className="flex items-center gap-3 overflow-hidden">
                         <div className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0 shadow-sm">
                           <FileText className="w-4 h-4 text-gray-400" />
                         </div>
                         <div className="truncate">
                           <p className="text-sm font-bold text-gray-700 truncate">{doc.file_name}</p>
                           <p className="text-[10px] font-mono text-gray-400 uppercase">{doc.file_type?.split('/')[1] || 'DOC'}</p>
                         </div>
                       </div>
                       <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 group-hover:text-[#E8602A]">
                         <Download className="w-4 h-4" />
                       </Button>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-sm text-gray-500 italic">No supplemental documents uploaded.</p>
               )}
             </CardContent>
          </Card>

          {/* Notice Generation Block */}
          {notice && (
            <Card className="bg-[#0F0F0F] text-white shadow-xl shadow-black/10 border-white/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017]/20 blur-[80px] rounded-full pointer-events-none"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <FileOutput className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-syne">Generated Document</h2>
                    <p className="text-sm text-gray-400">Your final deliverable is ready.</p>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{caseData.case_type === 'legal_notice' ? 'Formal Legal Notice' : 'Agreement Audit Report'}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">Status: <span className="text-green-500 uppercase">{notice.status}</span></p>
                    </div>
                    <Button className="bg-[#D4A017] hover:bg-[#B8860B] text-black font-bold shadow-lg">
                      <Download className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                  </div>
                </div>
                
                {notice.delivery_method && (
                  <p className="text-[11px] text-gray-500 font-mono text-center">
                    Dispatched via {notice.delivery_method.replace('_', ' ')} on {new Date(notice.sent_at || notice.created_at).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
