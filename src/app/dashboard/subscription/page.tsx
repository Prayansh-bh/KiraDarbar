"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, ShieldAlert, CreditCard, CheckCircle2, History, AlertCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { generateReceipt } from "@/utils/receipt";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justActivated = searchParams.get("activated") === "true";

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const [
        { data: userData },
        { data: paymentData }
      ] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      setProfile(userData);
      setPayments(paymentData || []);
      setLoading(false);
    }
    loadData();
  }, [router, supabase]);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    const product = isAnnual ? 'shield_annual' : 'shield_monthly';

    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product })
      });

      const { order_id, amount, key_id } = await orderRes.json();

      const options = {
        key: key_id,
        amount: amount,
        currency: "INR",
        name: "KiraDarbar Shield",
        description: `Shield Pro ${isAnnual ? 'Annual' : 'Monthly'} Subscription`,
        image: "https://kiradarbar.in/logo.png",
        order_id: order_id,
        handler: async function (response: any) {
          try {
            // Call our dedicated activation endpoint (uses authenticated session)
            const activateRes = await fetch("/api/payments/activate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                product: product,
              })
            });

            if (activateRes.ok) {
              // Hard redirect to force a full page refresh and reload profile state
              window.location.href = "/dashboard/subscription?activated=true";
            } else {
              const errData = await activateRes.json();
              console.error("Activation failed:", errData.error);
              alert("Payment received but activation failed: " + errData.error + "\nPlease contact support.");
              setIsProcessing(false);
            }
          } catch (err) {
            console.error("Activation error:", err);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: profile?.full_name,
          contact: profile?.phone 
        },
        theme: {
          color: "#E8602A"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
         alert("Payment failed: " + response.error.description);
         setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("System failed to configure checkout gateway.");
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel your Shield subscription? You will lose active protection at the end of your billing cycle.");
    if (confirmed) {
       alert("Cancel request recorded. A support agent will process this within 24 hours.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
        <div className="h-48 bg-gray-200 rounded-2xl mt-8"></div>
      </div>
    );
  }

  const isShield = profile?.plan === 'shield';

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div>
        <h1 className="text-3xl font-bold font-syne text-white">Shield Subscription</h1>
        <p className="text-gray-400 mt-1">Manage your tenant protection plan and billing history.</p>
      </div>

      {justActivated && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4"
        >
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-900">🎉 Payment Successful! Shield Pro is now active.</p>
            <p className="text-xs text-green-700 mt-0.5">Your account has been upgraded. All features are now unlocked.</p>
          </div>
        </motion.div>
      )}

      {isShield ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-2 border-[#D4A017] shadow-[0_8px_30px_rgb(212,160,23,0.12)] overflow-hidden">
            <div className="bg-[#0F0F0F] text-white p-8 md:p-10 relative overflow-hidden">
              <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4A017]/20 border border-[#D4A017]/40 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#D4A017] mb-4">
                    Active Protection
                  </div>
                  <h2 className="text-4xl font-bold font-syne italic">Shield Pro</h2>
                  <p className="text-gray-400 mt-2 font-medium">Your tenant rights are actively monitored and protected.</p>
                </div>
                
                <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 text-center min-w-[200px]">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Next Renewal</p>
                  <p className="font-mono text-xl text-white">
                    {profile?.plan_expires_at ? new Date(profile.plan_expires_at).toLocaleDateString('en-IN') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-8 bg-[#1A1A1A]">
              <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Included Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  "1 Free Legal Notice per year",
                  "Unlimited Agreement Reviews",
                  "Priority Email & Chat Support",
                  "Deposit Recovery Assistance",
                  "Tenant Background Reference Checks"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="font-medium text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
                <Button variant="outline" onClick={handleCancel} className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 bg-transparent border-white/10">
                  Cancel Subscription
                </Button>
                <Button className="bg-[#E8602A] text-white hover:bg-[#ff7a45] font-bold">
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start sm:items-center gap-4 mb-8">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">Your account is currently unprotected.</p>
              <p className="text-xs text-amber-700 mt-1">Free users pay per case. Shield users receive comprehensive protection starting at ₹199/month.</p>
            </div>
          </div>

          <Card className="border border-white/5 shadow-none overflow-hidden bg-[#1A1A1A]">
            <div className="bg-[#0F0F0F] text-white p-8 text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.8),transparent_70%)] pointer-events-none"></div>
               <h2 className="text-3xl font-bold font-syne mb-2 relative z-10">Upgrade to Shield</h2>
               <p className="text-gray-400 relative z-10">Stop worrying about illegal evictions and lost deposits.</p>
               
               <div className="mt-8 flex justify-center relative z-10">
                <div className="bg-[#1A1A1A] p-1 rounded-full inline-flex border border-white/10">
                  <button onClick={() => setIsAnnual(false)} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${!isAnnual ? 'bg-white text-black' : 'text-gray-400'}`}>Monthly</button>
                  <button onClick={() => setIsAnnual(true)} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white text-black' : 'text-gray-400'}`}>
                    Annual <span className="bg-[#E8602A] text-white text-[9px] uppercase px-2 py-0.5 rounded-full">Save ₹889</span>
                  </button>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className="flex-1 space-y-4 w-full">
                    {[
                      "1 Free Legal Notice per year (₹799 value)",
                      "Unlimited Agreement Reviews (₹499 value each)",
                      "Priority Support from Paralegals",
                      "Tenant Legal Helpline Access"
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="font-medium text-gray-300 text-sm">{feat}</span>
                      </div>
                    ))}
                 </div>
                 <div className="w-full md:w-[300px] bg-[#161616] border border-white/10 rounded-xl p-6 text-center shrink-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Price</p>
                    <div className="text-5xl font-bold font-syne text-[#D4A017] mb-2">
                      {isAnnual ? '₹1,499' : '₹199'}
                    </div>
                    <p className="text-gray-500 text-xs mb-6 mb-6 font-mono">{isAnnual ? 'Billed annually' : 'Billed monthly'}</p>
                    
                    <Button 
                      onClick={handleUpgrade} 
                      disabled={isProcessing || isShield} 
                      className={`w-full font-bold h-12 shadow-md transition-all ${
                        isShield 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 cursor-default' 
                          : 'bg-[#D4A017] hover:bg-[#B8860B] text-black'
                      }`}
                    >
                      {isShield ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Active Protection</>
                      ) : (
                        <>{isProcessing ? "Processing..." : "Activate Protection"} <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                       <CreditCard className="w-3 h-3" /> Secure Razorpay Checkout
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Payment History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xl font-bold font-syne text-white mb-6 mt-12 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-400" /> Payment History
        </h2>

        {payments.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-8 text-center">
             <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-3" />
             <p className="text-gray-400 font-medium text-sm">No payment history found.</p>
          </div>
        ) : (
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden shadow-none">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-[#161616] text-gray-400 text-[10px] uppercase tracking-widest font-bold border-b border-white/5">
                   <tr>
                     <th className="px-6 py-4">Transaction Date</th>
                     <th className="px-6 py-4">Description</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Receipt</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {payments.map(p => (
                     <tr key={p.id} className="hover:bg-white/5 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-gray-400">
                         {new Date(p.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric'})}
                       </td>
                       <td className="px-6 py-4 font-medium text-gray-300">
                         {p.product.replace('_', ' ').toUpperCase()}
                       </td>
                       <td className="px-6 py-4 font-mono font-bold text-white">
                         ₹{(p.amount / 100).toLocaleString('en-IN')}
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                           p.status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-gray-400'
                         }`}>
                           {p.status}
                         </span>
                       </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => generateReceipt({
                              ...p,
                              user_name: profile?.full_name,
                              user_email: profile?.email
                            })}
                            className="text-[#E8602A] text-xs font-bold hover:underline"
                          >
                            Download
                          </button>
                        </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </motion.div>

    </div>
  );
}
