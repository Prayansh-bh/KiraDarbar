"use client";

import { useEffect, useState } from "react";
import { 
  Briefcase, 
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  UserPlus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminCasesDirectory() {
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<any[]>([]);
  const [paralegals, setParalegals] = useState<any[]>([]);
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      // Fetch all cases across the system
      const { data: allCases } = await supabase
        .from('cases')
        .select(`
          *,
          users!cases_user_id_fkey (full_name, phone),
          assignee:users!cases_assigned_paralegal_fkey (full_name)
        `)
        .order('created_at', { ascending: false });

      // Fetch paralegals for the assignment dropdown
      const { data: staffData } = await supabase
        .from('users')
        .select('id, full_name')
        .in('role', ['admin', 'paralegal']);

      setCases(allCases || []);
      setParalegals(staffData || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const updateCaseStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('cases').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setCases(cases.map(c => c.id === id ? { ...c, status: newStatus } : c));
    }
  };

  const updateCaseAssignment = async (id: string, paralegalId: string) => {
    const { error } = await supabase.from('cases').update({ assigned_paralegal: paralegalId || null }).eq('id', id);
    if (!error) {
      const match = paralegals.find(p => p.id === paralegalId);
      setCases(cases.map(c => c.id === id ? { ...c, assigned_paralegal: paralegalId, assignee: match ? { full_name: match.full_name } : null } : c));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-gray-100 text-gray-600';
      case 'under_review': return 'bg-amber-100 text-amber-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-slate-100 text-slate-500';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredCases = cases.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchType = filterType === 'all' || c.case_type === filterType;
    const searchString = `${c.title} ${c.id} ${c.users?.full_name}`.toLowerCase();
    const matchSearch = search === '' || searchString.includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-syne text-[#0F0F0F]">Global Case Directory</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage, assign, and track all tenant disputes in the system.</p>
        </div>
      </div>

      <Card className="rounded-xl shadow-sm border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, User, or Title..." 
              className="pl-10 h-10 w-full bg-gray-50 border-gray-200 focus-visible:ring-[#E8602A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#E8602A] outline-none bg-gray-50 w-full sm:w-auto"
            >
              <option value="all">All Types</option>
              <option value="legal_notice">Legal Notice</option>
              <option value="agreement_review">Agreement Review</option>
              <option value="deposit_recovery">Deposit Recovery</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#E8602A] outline-none bg-gray-50 w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[500px] bg-white">
          {loading ? (
            <div className="p-12 space-y-4 animate-pulse">
              {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg w-full border border-gray-100"></div>)}
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-24 text-center text-gray-500">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800">No cases found</h3>
              <p className="text-sm mt-1">Adjust your filters or search query.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">ID & Filed Date</th>
                  <th className="px-6 py-4">Tenant Info</th>
                  <th className="px-6 py-4">Case Type</th>
                  <th className="px-6 py-4">Status & Assignment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCases.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-gray-800">KD-{c.id.split('-')[0].toUpperCase()}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{new Date(c.created_at).toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{c.users?.full_name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.title.substring(0, 30)}...</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium text-xs uppercase tracking-wider">
                      {c.case_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={c.status}
                          onChange={(e) => updateCaseStatus(c.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded outline-none cursor-pointer ${getStatusColor(c.status)} border-transparent focus:ring-1 focus:ring-gray-300 appearance-none`}
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <UserPlus className="w-3 h-3 text-gray-400" />
                        <select
                          value={c.assigned_paralegal || ''}
                          onChange={(e) => updateCaseAssignment(c.id, e.target.value)}
                          className="bg-transparent border-none p-0 outline-none font-bold text-indigo-600 cursor-pointer appearance-none uppercase tracking-wider"
                        >
                           <option value="">Unassigned</option>
                           {paralegals.map(p => (
                             <option key={p.id} value={p.id}>{p.full_name}</option>
                           ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/cases/${c.id}`}>
                        <Button variant="outline" size="sm" className="font-bold text-gray-700 hover:text-[#0F0F0F] border-gray-200">
                          Work <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
