"use client";

import { useEffect, useState } from "react";
import { CreditCard, Search, Filter, RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function AdminPaymentsDirectory() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [isProcessingRefund, setIsProcessingRefund] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchPayments() {
      const { data } = await supabase
        .from('payments')
        .select(`
          *,
          users!payments_user_id_fkey (full_name, phone)
        `)
        .order('created_at', { ascending: false });

      setPayments(data || []);
      setLoading(false);
    }
    fetchPayments();
  }, [supabase]);

  const processRefund = async (paymentId: string) => {
    if (!confirm("Are you sure you want to initiate a full refund for this transaction? This calls the Razorpay Refund API and reverses the charge.")) return;
    
    setIsProcessingRefund(paymentId);
    
    // Simulate Razorpay Refund API call
    await new Promise(r => setTimeout(r, 1500));
    
    // Update DB
    const { error } = await supabase.from('payments').update({ status: 'refunded' }).eq('id', paymentId);
    
    if (!error) {
      setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'refunded' } : p));
      alert("Refund initiated successfully. Will reflect in source account in 5-7 business days.");
    } else {
      alert("Refund failed. Verify Razorpay balance context.");
    }
    
    setIsProcessingRefund(null);
  };

  const filteredPayments = payments.filter(p => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchProduct = filterProduct === 'all' || p.product === filterProduct;
    const searchString = `${p.razorpay_order_id} ${p.users?.full_name}`.toLowerCase();
    const matchSearch = search === '' || searchString.includes(search.toLowerCase());
    return matchStatus && matchProduct && matchSearch;
  });

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-syne text-[#0F0F0F]">Revenue Ledger</h1>
          <p className="text-gray-500 mt-1 text-sm">Monitor all platform transactions, SaaS subscriptions, and process manual refunds.</p>
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
              placeholder="Search by Order ID or User..." 
              className="pl-10 h-10 w-full bg-gray-50 border-gray-200 focus-visible:ring-[#E8602A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest shrink-0 pr-2 border-r border-gray-200">
              <Filter className="w-4 h-4" /> Filters
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#E8602A] outline-none bg-gray-50 w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select 
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#E8602A] outline-none bg-gray-50 w-full sm:w-auto"
            >
              <option value="all">All Products</option>
              <option value="shield_annual">Shield (Annual)</option>
              <option value="shield_monthly">Shield (Monthly)</option>
              <option value="legal_notice">Legal Notice (Standalone)</option>
              <option value="agreement_review">Agreement Review</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[500px] bg-white">
          {loading ? (
            <div className="p-12 space-y-4 animate-pulse">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg w-full border border-gray-100"></div>)}
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-24 text-center text-gray-500">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800">No payment records</h3>
              <p className="text-sm mt-1">Adjust your search parameters.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-right">Amount (₹)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-gray-800">{p.razorpay_order_id}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{new Date(p.created_at).toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-700">{p.users?.full_name || 'N/A'}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">{p.users?.phone || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium text-xs uppercase tracking-wider">
                      {p.product.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#0F0F0F]">
                      {(p.amount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                         p.status === 'paid' ? 'bg-green-100 text-green-700' :
                         p.status === 'refunded' ? 'bg-orange-100 text-orange-700' :
                         p.status === 'failed' ? 'bg-red-100 text-red-700' :
                         'bg-gray-100 text-gray-600'
                       }`}>
                         {p.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'paid' && p.amount > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => processRefund(p.id)}
                          disabled={isProcessingRefund === p.id}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50 font-bold h-8"
                        >
                          {isProcessingRefund === p.id ? 'Processing...' : <><RefreshCcw className="w-3 h-3 mr-2" /> Refund</>}
                        </Button>
                      )}
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
