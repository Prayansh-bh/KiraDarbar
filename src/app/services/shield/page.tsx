import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle2, Star, Zap, Lock, Gavel, Search, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "Shield Pro Subscription | KiraDarbar — Tenant Legal Protection",
  description: "Get year-round legal protection for your tenancy. Includes free legal notices, unlimited agreement reviews, and priority paralegal support.",
  alternates: {
    canonical: 'https://kiradarbar.in/services/shield',
  },
};

export default function ShieldServicePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Shield Pro Subscription',
    provider: {
      '@type': 'Organization',
      name: 'KiraDarbar',
      url: 'https://kiradarbar.in'
    },
    description: 'Annual or monthly subscription providing continuous legal protection, document reviews, and dispute assistance for tenants in India.',
    offers: {
      '@type': 'Offer',
      price: '1499.00',
      priceCurrency: 'INR'
    },
    serviceType: 'Legal Subscription',
    areaServed: 'India'
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] font-dm-sans selection:bg-[#E8602A]/20 pt-20 pb-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.1),transparent_70%)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A017]/10 border border-[#D4A017]/30 rounded-full text-[#D4A017] text-sm font-semibold">
              <Zap className="w-4 h-4 fill-[#D4A017]" /> Most Value for Long-Term Renters
            </div>
            <h1 className="text-4xl md:text-7xl font-bold font-syne tracking-tight leading-tight">
              Total <span className="text-[#D4A017] italic">Shield</span> for Your Home.
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-xl mx-auto md:mx-0">
              One subscription. Complete peace of mind. Let our legal team defend your housing rights all year round.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/dashboard/subscription">
                <Button className="h-16 px-12 bg-[#D4A017] hover:bg-[#B8860B] text-black font-bold text-xl rounded-xl shadow-2xl transition-all hover:scale-105">
                  Upgrade to Shield Pro
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-[450px]">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-2 border-[#D4A017]/50 rounded-3xl p-10 shadow-[0_0_60px_rgba(212,160,23,0.15)] space-y-8">
               <div className="flex justify-between items-center">
                  <div className="w-16 h-16 bg-[#D4A017]/20 rounded-2xl flex items-center justify-center">
                     <Shield className="w-8 h-8 text-[#D4A017]" />
                  </div>
                  <div className="text-right">
                     <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pricing</div>
                     <div className="text-3xl font-black font-syne">₹199<span className="text-sm text-gray-500 font-medium">/mo</span></div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                    { icon: Gavel, t: "1 Free Legal Notice per year" },
                    { icon: Search, t: "Unlimited Agreement Reviews" },
                    { icon: Headphones, t: "Priority 24/7 Helpline" },
                    { icon: CheckCircle2, t: "Deposit Recovery Support" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                       <item.icon className="w-5 h-5 text-[#D4A017]" />
                       <span className="font-medium text-gray-300">{item.t}</span>
                    </div>
                  ))}
               </div>
               
               <div className="bg-[#D4A017]/5 p-4 rounded-xl border border-[#D4A017]/10 border-dashed text-center">
                  <div className="text-[#D4A017] font-bold text-sm">Save 40% with Annual Plan</div>
                  <div className="text-white font-black text-lg">₹1,499 /year</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold font-syne text-gray-900 tracking-tight">The Shield Edge.</h2>
            <p className="text-gray-500 text-lg">Why 90% of our active users choose Shield Pro.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Feature</th>
                  <th className="py-6 font-bold text-gray-400 uppercase tracking-widest text-xs text-center px-4">Standard</th>
                  <th className="py-6 font-bold text-[#D4A017] uppercase tracking-widest text-xs text-center bg-[#D4A017]/5 rounded-t-xl px-4">Shield Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "Legal Notices", s: "₹799 each", sh: "1 Free included" },
                  { f: "Agreement Reviews", s: "₹499 each", sh: "Unlimited & Free" },
                  { f: "Response Time", s: "24-48 Hours", sh: "Under 4 Hours" },
                  { f: "Dispute Escalation", s: "Not included", sh: "Full Assistance" },
                  { f: "Helpline", s: "Email Only", sh: "Priority Direct Line" }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 group">
                    <td className="py-6 font-bold text-gray-800">{row.f}</td>
                    <td className="py-6 text-gray-400 text-center px-4">{row.s}</td>
                    <td className="py-6 text-gray-900 font-black text-center bg-[#D4A017]/5 px-4 group-last:rounded-b-xl">{row.sh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-24 px-6 bg-[#111] flex justify-center">
        <div className="max-w-2xl text-center space-y-8">
           <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-[#D4A017] fill-current" />)}
           </div>
           <p className="text-2xl md:text-3xl font-medium leading-relaxed italic text-gray-300">
             "Having Shield Pro is like having a lawyer in your pocket. My landlord didn't even argue once he saw my subscription badge on the notice."
           </p>
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 mb-2"></div>
              <div className="font-bold">Animesh Gupta</div>
              <div className="text-sm text-gray-500 font-mono">Tenant in Gurgaon</div>
           </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-24 px-6 text-center space-y-12 bg-[#0F0F0F]">
         <h2 className="text-3xl font-bold font-syne">Have questions about the coverage?</h2>
         <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link href="/dashboard/subscription">
              <Button className="h-14 px-10 bg-white text-black hover:bg-gray-200 font-bold rounded-xl shadow-xl transition-all">
                 View All Benefits
              </Button>
            </Link>
            <Button variant="outline" className="h-14 px-10 border-white/20 text-white hover:bg-white/5 rounded-xl transition-all">
               Speak to Support
            </Button>
         </div>
         <div className="pt-8 text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> Cancel anytime. No lock-in.
         </div>
      </section>
    </div>
  );
}
