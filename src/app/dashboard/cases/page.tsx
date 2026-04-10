"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CasesDirectory() {
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchCases() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setCases(data || []);
      setLoading(false);
    }
    fetchCases();
  }, [router, supabase]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'under_review': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'resolved': return 'bg-green-50 text-green-600 border-green-200';
      case 'closed': return 'bg-gray-50 text-gray-400 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredCases = cases.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchType = filterType === 'all' || c.case_type === filterType;
    return matchStatus && matchType;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold font-syne text-white">My Cases</h1>
          <p className="text-gray-400 mt-1">Track notices, reviews, and deposit recoveries.</p>
        </motion.div>
        <Link href="/dashboard/cases/new">
          <Button className="bg-[#E8602A] hover:bg-[#D4501D] text-white font-bold h-12 px-6 shadow-sm">
            <Plus className="w-5 h-5 mr-2" /> File New Case
          </Button>
        </Link>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl shadow-none border border-white/5 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-white/5 bg-[#161616] flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest shrink-0">
            <Filter className="w-4 h-4" /> Filters
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto h-10 px-4 rounded border border-white/10 bg-[#0F0F0F] text-white text-sm font-medium focus:ring-2 focus:ring-[#E8602A] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto h-10 px-4 rounded border border-white/10 bg-[#0F0F0F] text-white text-sm font-medium focus:ring-2 focus:ring-[#E8602A] outline-none"
          >
            <option value="all">All Case Types</option>
            <option value="legal_notice">Legal Notice</option>
            <option value="agreement_review">Agreement Review</option>
            <option value="deposit_recovery">Deposit Recovery</option>
          </select>
        </div>

        {/* List */}
        <div>
          {loading ? (
            <div className="p-12 space-y-4 animate-pulse">
              {[1,2,3].map(i => (
                 <div key={i} className="h-16 bg-gray-100 rounded-lg w-full"></div>
              ))}
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-20 text-center text-gray-500">
              <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold font-syne text-white mb-2">No cases found</h3>
              <p className="text-sm">You haven't filed any cases matching this criteria.</p>
            </div>
          ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-[#161616] text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                   <tr>
                     <th className="px-6 py-4">Case Details</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Type</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {filteredCases.map(c => (
                     <tr key={c.id} className="hover:bg-white/5 transition-colors">
                       <td className="px-6 py-4">
                         <div className="font-bold text-white">{c.title}</div>
                         <div className="text-gray-400 font-mono text-xs">{new Date(c.created_at).toLocaleDateString('en-IN')} • ID: {c.id.split('-')[0]}</div>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(c.status)}`}>
                           {c.status.replace('_', ' ')}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-gray-300 font-medium">
                         {c.case_type.replace('_', ' ')}
                       </td>
                       <td className="px-6 py-4 font-mono font-bold text-gray-300">
                         {c.amount_disputed ? `₹${c.amount_disputed.toLocaleString('en-IN')}` : '-'}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <Link href={`/dashboard/cases/${c.id}`}>
                           <Button variant="ghost" size="sm" className="font-bold text-[#E8602A] hover:bg-[#E8602A]/10">
                             View <ArrowRight className="w-4 h-4 ml-2" />
                           </Button>
                         </Link>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
