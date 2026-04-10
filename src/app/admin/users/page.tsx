"use client";

import { useEffect, useState } from "react";
import { Users, Search, Filter, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function AdminUsersDirectory() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");

  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      // Note: fetching auth users requires service_role key, or we just fetch from our public.users table.
      const { data } = await supabase
        .from('users')
        .select(`
          *,
          cases (id)
        `)
        .order('created_at', { ascending: false });

      setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, [supabase]);

  const filteredUsers = users.filter(u => {
    const matchPlan = filterPlan === 'all' || u.plan === filterPlan;
    const searchString = `${u.full_name} ${u.phone} ${u.city}`.toLowerCase();
    const matchSearch = search === '' || searchString.includes(search.toLowerCase());
    return matchPlan && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-syne text-[#0F0F0F]">Users Directory</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage tenant profiles and view their active subscriptions.</p>
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
              placeholder="Search by name, phone, or city..." 
              className="pl-10 h-10 w-full bg-gray-50 border-gray-200 focus-visible:ring-[#E8602A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest shrink-0 pr-2 border-r border-gray-200">
              <Filter className="w-4 h-4" /> Filters
            </div>
            
            <select 
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#E8602A] outline-none bg-gray-50 w-full sm:w-auto"
            >
              <option value="all">All Plans</option>
              <option value="free">Free Tenants</option>
              <option value="shield">Shield Pro</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[500px] bg-white">
          {loading ? (
            <div className="p-12 space-y-4 animate-pulse">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg w-full border border-gray-100"></div>)}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-24 text-center text-gray-500">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800">No users found</h3>
              <p className="text-sm mt-1">Adjust your search parameters.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Tenant Identity</th>
                  <th className="px-6 py-4">Contact & Location</th>
                  <th className="px-6 py-4">Subscription</th>
                  <th className="px-6 py-4">Total Cases</th>
                  <th className="px-6 py-4 text-right">Insights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        {u.full_name}
                        {u.role === 'admin' && <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest">Admin</span>}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1 font-mono">Joined {new Date(u.created_at).toLocaleDateString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 font-mono text-xs">{u.phone}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{u.city || 'N/A'}, {u.state || 'India'}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                         u.plan === 'shield' ? 'bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20' : 'bg-gray-50 text-gray-500 border-gray-200'
                       }`}>
                         {u.plan === 'shield' && <ShieldCheck className="w-3 h-3" />}
                         {u.plan}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-bold font-mono">
                      {u.cases?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="font-bold text-[#E8602A] hover:bg-[#E8602A]/10">
                        Profile <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
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
