import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Gavel, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "Send Legal Notice to Landlord | KiraDarbar — Tenant Legal Protection",
  description: "Send a professional lawyer-signed legal notice to your landlord for deposit recovery, illegal eviction, or harassment. Registered post + digital copy included.",
  alternates: {
    canonical: 'https://kiradarbar.in/services/legal-notice',
  },
};

export default function LegalNoticePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Lawyer-Signed Legal Notice',
    provider: {
      '@type': 'Organization',
      name: 'KiraDarbar',
      url: 'https://kiradarbar.in'
    },
    description: 'Professional legal notice drafted by advocates for tenant-landlord disputes including security deposit recovery and eviction stays.',
    offers: {
      '@type': 'Offer',
      price: '799.00',
      priceCurrency: 'INR'
    },
    serviceType: 'Legal Service',
    areaServed: 'India'
  };

  return (
    <div className="min-h-screen bg-white font-dm-sans selection:bg-[#E8602A]/20 pt-20 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="bg-[#0F0F0F] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(232,96,42,0.6),transparent_70%)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8602A]/10 border border-[#E8602A]/30 rounded-full text-[#E8602A] text-sm font-semibold">
              <Gavel className="w-4 h-4" /> Professional Legal Support
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-syne tracking-tight leading-tight">
              Get Your Security Deposit Refunded with a <span className="text-[#E8602A] italic">Legal Notice</span>.
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-xl mx-auto md:mx-0">
              Stop waiting and start acting. A formal lawyer-signed notice is often all it takes to make a landlord comply.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/dashboard/cases/new">
                <Button className="h-14 px-10 bg-[#E8602A] hover:bg-[#D4501D] text-white font-bold text-lg rounded shadow-lg transition-all">
                  Send Your Notice Now — ₹799
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-[400px] h-[500px] bg-white rounded-md shadow-2xl flex flex-col overflow-hidden transform rotate-2">
             <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="text-lg font-bold font-syne text-gray-900">KiraDarbar.</div>
                <div className="text-[10px] text-gray-400 font-mono text-center">REF: KD-LGL-001</div>
             </div>
             <div className="p-6 flex-1 space-y-4 opacity-50 relative">
               <div className="w-16 h-16 border-[3px] border-red-600/80 rounded-full flex items-center justify-center absolute top-10 right-6 opacity-30 transform -rotate-12 pointer-events-none">
                 <span className="text-red-600/80 font-bold text-[8px] uppercase tracking-widest text-center leading-tight">LEGAL<br/>NOTICE</span>
               </div>
               <div className="h-2 w-1/3 bg-gray-200 rounded"></div>
               <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
               <div className="h-24 w-full bg-gray-50 rounded mt-8"></div>
               <div className="h-24 w-full bg-gray-50 rounded"></div>
               <div className="mt-auto pt-8 border-l-4 border-[#E8602A] pl-4">
                 <div className="h-6 w-1/2 bg-gray-200 rounded italic signature-font">Adv. R. K. Sharma</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#E8602A]/10 rounded-xl flex items-center justify-center">
                 <Shield className="w-6 h-6 text-[#E8602A]" />
              </div>
              <h3 className="text-xl font-bold font-syne text-gray-900">Lawyer Signed</h3>
              <p className="text-gray-600 leading-relaxed">
                Drafted and signed by enrolled advocates specialized in Indian Rent Control acts.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                 <Send className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold font-syne text-gray-900">Registered Post AD</h3>
              <p className="text-gray-600 leading-relaxed">
                Dispatched via Registered Post with Acknowledgment Due. Physical proof for any future court action.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                 <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold font-syne text-gray-900">PDF Copy</h3>
              <p className="text-gray-600 leading-relaxed">
                Instant digital version available in your dashboard the moment it's finalized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-center text-gray-900 tracking-tight">What the notice covers.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Security Deposit Non-Payment",
              "Illegal Eviction Threats",
              "Unreasonable Deduction Disputes",
              "Lack of Maintenance Services",
              "Illegal Utility Disconnections",
              "Violation of Notice Clauses",
              "Harassment by Landlord",
              "Refusal to Sign Renewals"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <CheckCircle2 className="w-6 h-6 text-[#E8602A]" />
                <span className="font-bold text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 flex justify-center text-center">
        <div className="max-w-3xl space-y-8">
           <h2 className="text-4xl md:text-5xl font-bold font-syne text-gray-900 tracking-tight leading-tight">
             Ready to reclaim what is yours?
           </h2>
           <p className="text-lg text-gray-500 max-w-xl mx-auto">
             Takes 5 minutes to fill the details. Our team takes care of the rest within 24 hours.
           </p>
           <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard/cases/new">
                <Button className="h-16 px-12 bg-[#111] hover:bg-[#333] text-white font-bold text-xl rounded-xl shadow-xl transition-all hover:scale-105">
                   Request Legal Notice
                </Button>
              </Link>
           </div>
           <div className="text-sm font-medium text-gray-400">
             7-day resolution window for most cases.
           </div>
        </div>
      </section>
    </div>
  );
}
