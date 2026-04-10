"use client";

import { useEffect, useState } from "react";
import { 
  Briefcase, 
  CreditCard, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ totalCases: 0, casesThisWeek: 0, revenueMonth: 0, resolvedCases: 0 });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // Run queries with Admin access (Assuming RLS is handled or overridden)
      // Since this is client side, it would normally hit RLS. If RLS restricts, 
      // the paralegal/admin must have an RLS policy allowing them.
      // E.g., CREATE POLICY "Admins can view all cases" ON public.cases FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

      const [
        { data: cases, count: totalCases },
        { data: payments }
      ] = await Promise.all([
        supabase.from('cases').select('*', { count: 'exact' }),
        supabase.from('payments').select('amount, status, product, created_at, users(full_name)').order('created_at', { ascending: false }).limit(5)
      ]);

      const cData = cases || [];
      const pData = payments || [];

      // Calculate KPIs
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const casesThisWeek = cData.filter(c => new Date(c.created_at) > oneWeekAgo).length;

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const revenueMonth = pData
        .filter(p => p.status === 'paid' && new Date(p.created_at) > oneMonthAgo)
        .reduce((sum, p) => sum + (p.amount / 100), 0);

      const resolvedCases = cData.filter(c => c.status === 'resolved' || c.status === 'closed').length;

      setKpis({
        totalCases: totalCases || 0,
        casesThisWeek,
        revenueMonth,
        resolvedCases
      });

      setRecentPayments(pData);

      // Group chart data
      const statusCounts = cData.reduce((acc: any, curr) => {
        const s = curr.status;
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});

      setChartData([
        { name: 'Submitted', count: statusCounts['submitted'] || 0 },
        { name: 'Under Review', count: statusCounts['under_review'] || 0 },
        { name: 'In Progress', count: statusCounts['in_progress'] || 0 },
        { name: 'Resolved', count: statusCounts['resolved'] || 0 },
        { name: 'Closed', count: statusCounts['closed'] || 0 },
      ]);

      setLoading(false);
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-white rounded-xl border border-gray-200 w-full"></div>
        <div className="grid grid-cols-4 gap-6">
           <div className="h-32 bg-white border border-gray-200 rounded-xl"></div>
           <div className="h-32 bg-white border border-gray-200 rounded-xl"></div>
           <div className="h-32 bg-white border border-gray-200 rounded-xl"></div>
           <div className="h-32 bg-white border border-gray-200 rounded-xl"></div>
        </div>
        <div className="h-96 bg-white border border-gray-200 rounded-xl"></div>
      </div>
    );
  }

  const resolutionRate = kpis.totalCases > 0 ? Math.round((kpis.resolvedCases / kpis.totalCases) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Cases</p>
                <h3 className="text-3xl font-bold font-syne text-[#0F0F0F]">{kpis.totalCases}</h3>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center border border-gray-100">
                <Briefcase className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">New This Week</p>
                <h3 className="text-3xl font-bold font-syne text-[#0F0F0F]">{kpis.casesThisWeek}</h3>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center border border-blue-100">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Revenue (30d)</p>
                <h3 className="text-3xl font-bold font-syne text-[#0F0F0F]">₹{kpis.revenueMonth.toLocaleString('en-IN')}</h3>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-md flex items-center justify-center border border-green-100">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-gray-200 border-l-4 border-l-[#E8602A]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Resolution Rate</p>
                <h3 className="text-3xl font-bold font-syne text-[#0F0F0F]">{resolutionRate}%</h3>
              </div>
              <div className="w-10 h-10 bg-[#E8602A]/10 rounded-md flex items-center justify-center border border-[#E8602A]/20">
                <CheckCircle2 className="w-5 h-5 text-[#E8602A]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <Card className="lg:col-span-2 rounded-xl shadow-sm border-gray-200">
          <CardHeader className="pb-2 border-b border-gray-100">
            <CardTitle className="text-lg font-bold font-syne text-[#0F0F0F]">Cases by Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#0F0F0F" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card className="rounded-xl shadow-sm border-gray-200">
            <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold font-syne text-[#0F0F0F]">Operating Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Link href="/admin/cases?status=submitted" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#E8602A] hover:bg-orange-50 transition-colors group">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600"><AlertCircle className="w-4 h-4" /></div>
                   <span className="font-bold text-sm text-gray-700 group-hover:text-orange-700">Unreviewed Cases</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E8602A]" />
              </Link>
              <Link href="/admin/cases?has_drafts=true" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600"><FileText className="w-4 h-4" /></div>
                   <span className="font-bold text-sm text-gray-700 group-hover:text-blue-700">Draft Notices</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-gray-200 overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4 border-b border-gray-100 bg-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold font-syne text-[#0F0F0F]">Recent Payments</CardTitle>
              <Link href="/admin/payments" className="text-[10px] uppercase font-bold text-[#E8602A] tracking-wider hover:underline">View All</Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                 {recentPayments.length > 0 ? recentPayments.map((p, i) => (
                   <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                     <div>
                       <p className="text-sm font-bold text-gray-800">{p.users?.full_name || 'Unknown User'}</p>
                       <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">{p.product}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-sm font-bold text-[#0F0F0F] font-mono">₹{(p.amount / 100).toLocaleString('en-IN')}</p>
                       <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${p.status === 'paid' ? 'text-green-600' : 'text-gray-400'}`}>{p.status}</p>
                     </div>
                   </div>
                 )) : (
                   <div className="p-6 text-center text-sm text-gray-500">No recent transactions.</div>
                 )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
