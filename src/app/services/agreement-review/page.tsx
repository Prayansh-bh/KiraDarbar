import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search, AlertTriangle, CheckCircle2, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "Rental Agreement Review | KiraDarbar — Tenant Legal Protection",
  description: "Get your rental agreement reviewed by legal experts before signing. Identify illegal clauses, hidden charges, and unfair terms in Hindi & English.",
  alternates: {
    canonical: 'https://kiradarbar.in/services/agreement-review',
  },
};

export default function AgreementReviewPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Rental Agreement Review',
    provider: {
      '@type': 'Organization',
      name: 'KiraDarbar',
      url: 'https://kiradarbar.in'
    },
    description: 'Expert review of residential rental agreements to identify illegal clauses and protect tenant rights.',
    offers: {
      '@type': 'Offer',
      price: '499.00',
      priceCurrency: 'INR'
    },
    serviceType: 'Legal Service',
    areaServed: 'India'
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-dm-sans selection:bg-[#E8602A]/20 pt-20 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="bg-white py-24 px-6 relative overflow-hidden border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-semibold">
              <Search className="w-4 h-4" /> Comprehensive Expert Audit
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-syne tracking-tight leading-tight text-gray-900">
              Don't Sign an <span className="text-[#E8602A] italic">Illegal</span> Agreement.
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-xl mx-auto md:mx-0">
              Indian landlords often include clauses that are legally void. We flag them in 48 hours for just ₹499.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/dashboard/cases/new?product=agreement_review">
                <Button className="h-14 px-10 bg-[#111] hover:bg-[#333] text-white font-bold text-lg rounded shadow-lg transition-all">
                  Upload Agreement — ₹499
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-[450px] relative">
            <div className="absolute inset-0 bg-blue-100/30 blur-3xl rounded-full"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <FileText className="text-blue-500 w-6 h-6" />
                <div className="font-bold text-gray-900">Review Report #1029</div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                  <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">✕</div>
                  <div className="text-gray-700 font-bold">Clause 14: Non-Refundable Deposit</div>
                </div>
                <div className="pl-8 text-sm text-gray-500 italic">"This clause is legally void under Section 108 of the Transfer of Property Act..."</div>
                
                <div className="flex gap-3 text-sm">
                  <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">✕</div>
                  <div className="text-gray-700 font-bold">Clause 22: Unlimited Rent Hike</div>
                </div>
                <div className="pl-8 text-sm text-gray-500 italic">"Violation of Rent Control caps. Recommend negotiation to 10% maximum."</div>
              </div>
              <div className="pt-4 flex justify-between items-center text-xs font-bold text-gray-400 font-mono tracking-widest uppercase">
                <span>Vetted by Advocate</span>
                <span className="text-[#E8602A]">KiraDarbar Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Review Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold font-syne text-gray-900 tracking-tight">The 5 most dangerous clauses.</h2>
            <p className="text-gray-500 text-lg">We find these in 40% of all agreements we review.</p>
          </div>
          <div className="grid gap-6">
            {[
              { t: "Lock-in Periods", d: "Clauses preventing you from moving out even in emergencies." },
              { t: "Arbitrary Deductions", d: "Automatic deductions for 'painting' or 'cleaning' without bills." },
              { t: "Guest Bans", d: "Illegal restrictions on visitors or family members." },
              { t: "Maintenance Spikes", d: "Granting landlord unilateral power to increase fees overnight." },
              { t: "Immediate Eviction", d: "Wait periods that are shorter than the legally mandated 30 days." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-8 bg-[#FAF7F2] rounded-2xl border border-gray-100 group hover:bg-white hover:border-[#E8602A]/30 transition-all">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-red-500 group-hover:bg-red-50 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-bold font-syne animate-gradient-text text-gray-900">{item.t}</h3>
                  <p className="text-gray-600">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-[#0F0F0F] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-center mb-20 tracking-tight">How it works.</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", t: "Upload Document", d: "Plain PDF or high-quality photos/scans of your agreement draft." },
              { step: "02", t: "Expert Audit", d: "Specialized legal team reviews every clause against state-specific acts." },
              { step: "03", t: "Actionable Report", d: "Download your review report with exact items to negotiate or remove." }
            ].map((item, i) => (
              <div key={i} className="space-y-6 text-center md:text-left relative">
                <div className="text-6xl font-black font-syne text-white/5 absolute -top-10 left-0 md:-left-4 select-none">{item.step}</div>
                <h3 className="text-2xl font-bold font-syne relative z-10">{item.t}</h3>
                <p className="text-gray-400 relative z-10">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 flex justify-center text-center">
        <div className="max-w-3xl space-y-8">
           <h2 className="text-4xl md:text-5xl font-bold font-syne text-gray-900 tracking-tight leading-tight">
             Peace of mind for only ₹499.
           </h2>
           <p className="text-lg text-gray-500 max-w-xl mx-auto">
             Don't sign your rights away. Get the audit report before you meet your landlord.
           </p>
           <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard/cases/new?product=agreement_review">
                <Button className="h-16 px-12 bg-[#E8602A] hover:bg-[#D4501D] text-white font-bold text-xl rounded-xl shadow-xl transition-all hover:scale-105">
                   Request Agreement Review
                </Button>
              </Link>
           </div>
           <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-400">
             <Lock className="w-4 h-4" /> 256-bit Document Encryption
           </div>
        </div>
      </section>
    </div>
  );
}
