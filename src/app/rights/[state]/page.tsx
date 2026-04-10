import { createClient } from "@/utils/supabase/server";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// The slugified states matching our full list
const STATES = [
  "andaman-and-nicobar-islands", "andhra-pradesh", "arunachal-pradesh", "assam", "bihar", "chandigarh", "chhattisgarh", 
  "dadra-and-nagar-haveli-and-daman-and-diu", "delhi", "goa", "gujarat", "haryana", "himachal-pradesh", "jammu-and-kashmir", 
  "jharkhand", "karnataka", "kerala", "ladakh", "lakshadweep", "madhya-pradesh", "maharashtra", "manipur", "meghalaya", 
  "mizoram", "nagaland", "odisha", "puducherry", "punjab", "rajasthan", "sikkim", "tamil-nadu", "telangana", "tripura", 
  "uttar-pradesh", "uttarakhand", "west-bengal"
];

export const dynamic = "force-dynamic";

function unslugify(slug: string) {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateStaticParams() {
  return STATES.map((state) => ({
    state: state,
  }));
}

export async function generateMetadata({ params }: { params: { state: string } }) {
  // Await the entire params object before destructuring its properties
  const { state } = await params;
  const stateName = unslugify(state);
  return {
    title: `Tenant Rights in ${stateName} (2026) | KiraDarbar`,
    description: `Complete guide to renter and tenant rights under the ${stateName} Rent Control acts and Model Tenancy Act. Stop illegal eviction and deposit theft.`,
    openGraph: {
      title: `Tenant Rights in ${stateName}`,
      description: `Understand the laws protecting tenants in ${stateName}.`,
    }
  };
}

export default async function StateRightsPage({ params }: { params: { state: string } }) {
  // Await the params object here as well for Next.js 15+ compatibility
  const { state } = await params;
  const stateName = unslugify(state);
  const supabase = await createClient();
  
  // Fetch rights specific to this state or General
  const { data: rights } = await supabase
    .from('tenant_rights')
    .select('*')
    .or(`state.eq.${stateName},state.eq.General,state.ilike.${stateName}`)
    .order('category');

  // JSON-LD Schema for rich results
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": rights?.map(r => ({
      "@type": "Question",
      "name": `What are tenant rights regarding ${r.title} in ${stateName}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": r.content
      }
    })) || []
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-dm-sans selection:bg-[#E8602A]/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      {/* Hero */}
      <section className="bg-[#0F0F0F] text-white pt-24 pb-32 px-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(232,96,42,0.8),transparent_70%)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-[#D4A017] mb-4">
            <ShieldCheck className="w-4 h-4" /> Legal Guide 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-syne tracking-tight">
            Tenant Rights in <span className="text-[#E8602A] italic">{stateName}</span>.
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            Everything you need to know to stop unlawful eviction, secure your deposit, and deal with predatory landlords in {stateName}.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        
        {/* Laws Grid */}
        <div className="space-y-6">
          {rights && rights.length > 0 ? rights.map((right, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#E8602A]/10 text-[#E8602A] rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {right.category || 'General Protection'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-syne text-gray-900">{right.title}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {right.content || "Landlords are prohibited from taking unlawful actions under the Rent Control laws applicable to your jurisdiction. You possess enforceable rights to dispute this."}
                </p>
                <div className="pt-2 text-xs font-bold text-gray-500 font-mono flex items-center gap-2">
                   Reference: {right.legal_reference || `Applicable Rent Control Acts of ${stateName}`}
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
               <ShieldCheck className="w-12 h-12 text-[#E8602A] mx-auto mb-4" />
               <h2 className="text-2xl font-bold font-syne text-gray-900 mb-2">Standard protections apply in {stateName}</h2>
               <p className="text-gray-600">While specific local amendments weren't found in our immediate database, General Tenant Protections (including deposit limits and notice periods) apply under the Model Tenancy Act principles.</p>
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-[#0F0F0F] rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8602A]/20 blur-[80px] rounded-full"></div>
           <div className="space-y-4 relative z-10 flex-1 md:pr-12 text-center md:text-left mb-8 md:mb-0">
             <h3 className="text-3xl font-bold font-syne text-white">Is a landlord breaking these laws?</h3>
             <p className="text-gray-400">Our lawyers will draft a legal notice tailored to {stateName}'s jurisdiction and send it via registered post.</p>
           </div>
           <div className="relative z-10 w-full md:w-auto">
             <Link href="/services/legal-notice">
               <Button className="w-full md:w-auto h-14 bg-[#E8602A] hover:bg-[#D4501D] text-white font-bold text-lg px-8 shadow-lg">
                 Enforce Your Rights
               </Button>
             </Link>
           </div>
        </div>
      </main>
      
    </div>
  );
}
