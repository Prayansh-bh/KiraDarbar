"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Gavel, FileText, BadgeIndianRupee, HelpCircle, 
  UploadCloud, CheckCircle2, CreditCard, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Progress } from "@/components/ui/progress";

const FileUpload = ({ onFilesSelected, existingFiles }: any) => {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isDragging, setIsDragging] = useState(false);

  const simulateProgress = (fileName: string) => {
    setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const next = (prev[fileName] || 0) + 10;
        if (next >= 100) {
          clearInterval(interval);
          return { ...prev, [fileName]: 100 };
        }
        return { ...prev, [fileName]: next };
      });
    }, 100);
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const filesArray = Array.from(newFiles);
    onFilesSelected([...existingFiles, ...filesArray]);
    filesArray.forEach(f => simulateProgress(f.name));
  };

  return (
    <div className="space-y-6">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all relative ${
          isDragging ? 'border-[#E8602A] bg-[#E8602A]/10' : 'border-white/10 bg-[#0F0F0F] hover:bg-[#161616]'
        }`}
        role="button"
        aria-label="Upload evidence documents"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('file-upload')?.click(); }}
      >
        <input 
          id="file-upload"
          type="file" 
          multiple 
          accept=".pdf,.jpg,.png,.jpeg,.docx"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <UploadCloud className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragging ? 'text-[#E8602A]' : 'text-gray-400'}`} />
        <h3 className="font-bold text-white text-lg">Click to upload or drag & drop</h3>
        <p className="text-xs text-gray-400 mt-2 font-mono">Accepts PDF, JPG, PNG, DOCX up to 10MB</p>
      </div>

      {existingFiles.length > 0 && (
        <div className="space-y-3" role="list">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Files Uploaded ({existingFiles.length})</h4>
          {existingFiles.map((file: File, i: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }} 
              key={i} 
              className="p-4 bg-[#0F0F0F] border border-white/10 rounded-lg shadow-none space-y-2"
              role="listitem"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#E8602A]" />
                <span className="text-sm font-medium text-white truncate flex-1">{file.name}</span>
                <span className="text-xs text-gray-400 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                <Progress value={uploadProgress[file.name]} className="h-1 bg-white/10" />
              )}
              {uploadProgress[file.name] === 100 && (
                <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const CASE_TYPES = [
  { id: "legal_notice", title: "Legal Notice", desc: "Send a formally drafted notice to your landlord.", icon: Gavel, price: 799 },
  { id: "agreement_review", title: "Agreement Review", desc: "Our lawyers audit your rental agreement.", icon: FileText, price: 499 },
  { id: "deposit_recovery", title: "Deposit Recovery", desc: "Specialized process to reclaim stolen deposit.", icon: BadgeIndianRupee, price: 799 },
  { id: "rights_check", title: "Legal Consultation", desc: "Ask a paralegal a specific legal question.", icon: HelpCircle, price: 299 },
];

export default function NewCasePage() {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");

  // If a valid type is pre-selected from the URL, jump directly to step 2
  const validTypes = CASE_TYPES.map(t => t.id);
  const initialType = typeFromUrl && validTypes.includes(typeFromUrl) ? typeFromUrl : null;
  const initialStep = initialType ? 2 : 1;

  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [caseType, setCaseType] = useState<string | null>(initialType);
  const [details, setDetails] = useState({
    title: "",
    property_address: "",
    landlord_name: "",
    landlord_phone: "",
    amount_disputed: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleNext = () => setStep(s => Math.min(5, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handlePaymentAndSubmit = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // 1. Create Initial Case Entry
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        user_id: user.id,
        case_type: caseType,
        status: 'submitted',
        title: details.title,
        description: details.description,
        landlord_name: details.landlord_name,
        landlord_phone: details.landlord_phone,
        property_address: details.property_address,
        amount_disputed: details.amount_disputed ? parseFloat(details.amount_disputed) : null,
      })
      .select('id')
      .single();

    if (caseError) {
      console.error(caseError);
      alert("Error generating case. Please try again.");
      setLoading(false);
      return;
    }

    setCreatedCaseId(caseData.id);

    // 2. Upload Files (if any)
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${caseData.id}_${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('case-documents')
        .upload(filePath, file);

      if (!uploadError) {
        await supabase.from('documents').insert({
          case_id: caseData.id,
          user_id: user.id,
          file_name: file.name,
          storage_path: filePath,
          file_type: file.type
        });
      }
    }

    // 3. Request Razorpay Order
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: caseType, case_id: caseData.id })
      });

      if (!orderRes.ok) throw new Error("Failed to create Razorpay secure order.");

      const { order_id, amount, key_id } = await orderRes.json();

      // 4. Fire Razorpay Modal
      const options = {
        key: key_id,
        amount: amount,
        currency: "INR",
        name: "KiraDarbar",
        description: "Tenant Legal Service",
        image: "https://kiradarbar.in/logo.png", // placeholder
        order_id: order_id,
        handler: async function (response: any) {
           // 5. Verification Callback
           const verifyRes = await fetch("/api/payments/webhook", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_order_id: response.razorpay_order_id,
               razorpay_signature: response.razorpay_signature
             })
           });
           
           if (verifyRes.ok) {
              router.push(`/success?case_id=${caseData.id}`);
           } else {
              alert("Payment verification failed. Please contact support.");
              setLoading(false);
           }
        },
        prefill: {
          name: details.title, // User Name fallback ideally
          contact: details.landlord_phone // Actually tenant phone ideally, but using placeholder for demo
        },
        theme: {
          color: "#E8602A"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
         alert("Payment failed: " + response.error.description);
         setLoading(false);
      });
      
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Checkout initialization failed.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black font-syne italic text-white tracking-tighter">
          {initialType ? CASE_TYPES.find(t => t.id === initialType)?.title : "File a New Case"}
        </h1>
        <p className="text-gray-400 mt-2 font-medium">
          {initialType ? CASE_TYPES.find(t => t.id === initialType)?.desc : "Follow the steps to submit your legal request securely."}
        </p>
      </div>

      {/* Stepper Display */}
      {step < 5 && (
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black italic transition-all duration-500 ${
                step >= i ? 'bg-[#E8602A] text-white shadow-[0_5px_15px_rgba(232,96,42,0.3)]' : 'bg-gray-100 text-gray-400'
              }`}>
                {i}
              </div>
              {i < 4 && (
                <div className={`w-16 h-1 rounded-full mx-2 ${step > i ? 'bg-[#E8602A]' : 'bg-gray-100'}`}></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Content */}
      <div className="bg-[#1A1A1A] rounded-2xl shadow-none border border-white/5 p-6 md:p-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Case Type */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black font-syne italic text-white mb-8">Select Case Type</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {CASE_TYPES.map((type) => (
                  <div 
                    key={type.id} 
                    onClick={() => setCaseType(type.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCaseType(type.id); }}
                    tabIndex={0}
                    role="radio"
                    aria-checked={caseType === type.id}
                    className={`p-6 rounded-xl border border-white/5 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#E8602A] ${
                      caseType === type.id ? 'border-[#E8602A] bg-[#E8602A]/10' : 'bg-[#161616] hover:border-white/10 hover:bg-[#222]'
                    }`}
                  >
                    <type.icon className={`w-8 h-8 mb-4 ${caseType === type.id ? 'text-[#E8602A]' : 'text-gray-500'}`} />
                    <h3 className="font-bold text-lg text-white">{type.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{type.desc}</p>
                    <div className="mt-4 text-xs font-bold font-mono text-gray-500">Starting at ₹{type.price}</div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-end">
                <Button onClick={handleNext} disabled={!caseType} className="bg-[#E8602A] text-white hover:bg-[#ff7a45] font-black italic h-14 px-10 rounded-xl transition-all hover:scale-[1.02] shadow-xl">
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black font-syne italic text-white mb-8">Case Details</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Case Title (Short)</label>
                  <Input 
                    value={details.title} onChange={e => setDetails({...details, title: e.target.value})} 
                    placeholder="e.g. Unlawful Deposit Deduction" 
                    className="h-12 bg-[#0F0F0F] text-white border-white/10 placeholder:text-gray-600 focus-visible:border-[#E8602A]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Landlord Full Name</label>
                    <Input 
                      value={details.landlord_name} onChange={e => setDetails({...details, landlord_name: e.target.value})} 
                      placeholder="Name on agreement" 
                      className="h-12 bg-[#0F0F0F] text-white border-white/10 placeholder:text-gray-600 focus-visible:border-[#E8602A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Landlord Phone</label>
                    <Input 
                      value={details.landlord_phone} onChange={e => setDetails({...details, landlord_phone: e.target.value})} 
                      placeholder="+91..." 
                      className="h-12 bg-[#0F0F0F] text-white border-white/10 placeholder:text-gray-600 focus-visible:border-[#E8602A] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Property Address</label>
                  <Input 
                    value={details.property_address} onChange={e => setDetails({...details, property_address: e.target.value})} 
                    placeholder="Full disputed apartment address" 
                    className="h-12 bg-[#0F0F0F] text-white border-white/10 placeholder:text-gray-600 focus-visible:border-[#E8602A]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dispute Amount (Optional)</label>
                  <Input 
                    type="number"
                    value={details.amount_disputed} onChange={e => setDetails({...details, amount_disputed: e.target.value})} 
                    placeholder="₹ 50000" 
                    className="h-12 bg-[#0F0F0F] text-white border-white/10 placeholder:text-gray-600 focus-visible:border-[#E8602A] font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">What happened?</label>
                  <Textarea 
                    value={details.description} onChange={e => setDetails({...details, description: e.target.value})} 
                    placeholder="Explain the situation in your own words. Minimum 100 characters so our lawyers understand the context." 
                    className="min-h-[150px] bg-[#0F0F0F] text-white border-white/10 placeholder:text-gray-600 focus-visible:border-[#E8602A] resize-y"
                  />
                  <div className="text-right text-xs text-gray-400 font-mono">{details.description.length} / 100</div>
                </div>
              </div>

              <div className="mt-10 flex justify-between gap-4">
                <Button onClick={handleBack} variant="ghost" className="h-14 px-8 font-black italic text-gray-400 hover:text-white hover:bg-white/5"><ArrowLeft className="w-5 h-5 mr-2" /> Back</Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!details.title || details.description.length < 50} 
                  className="bg-[#E8602A] text-white hover:bg-[#ff7a45] font-black italic h-14 px-10 rounded-xl shadow-xl flex-1 sm:flex-none"
                >
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Documents */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold font-syne text-white mb-2">Upload Evidence</h2>
              <p className="text-sm text-gray-400 mb-6">Attach your Rent agreement, Deposit receipts, WhatsApp screenshots, or ID proof.</p>
                         <FileUpload 
                onFilesSelected={setFiles} 
                existingFiles={files} 
              />


              <div className="mt-8 flex justify-between">
                <Button onClick={handleBack} variant="outline" className="h-12 px-6 font-bold bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={handleNext} className="bg-[#E8602A] text-white hover:bg-[#ff7a45] font-bold h-12 px-8">
                  Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
               <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Order Summary</h3>
                <div className="bg-[#0F0F0F] text-white rounded-[20px] p-8 md:p-10 relative overflow-hidden shadow-2xl">
                  <Lock className="absolute top-6 right-6 w-5 h-5 text-gray-600" />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-syne font-bold tracking-tighter leading-tight">
                        {CASE_TYPES.find(t => t.id === caseType)?.title}
                      </h2>
                    </div>
                    <div className="text-5xl font-syne font-bold text-[#D4A017] tracking-tighter">
                      ₹{CASE_TYPES.find(t => t.id === caseType)?.price}
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/10 w-full mb-6"></div>
                  
                  <div className="flex flex-wrap gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> GST Included</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Refund Guarantee</span>
                  </div>
                </div>
               </div>

               <div className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-10 text-center space-y-4 mb-8">
                 <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-2">
                   <CreditCard className="w-8 h-8 text-gray-300" />
                 </div>
                 <div className="font-bold text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                   A secure Razorpay window will open to complete this transaction.
                 </div>
               </div>

               <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
                <Button 
                  onClick={handleBack} 
                  disabled={loading} 
                  variant="ghost" 
                  className="h-14 px-8 font-bold text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button 
                  onClick={handlePaymentAndSubmit} 
                  disabled={loading} 
                  className="w-full sm:w-auto min-w-[240px] h-14 bg-[#E8602A] hover:bg-[#ff7a45] text-white font-black italic text-lg shadow-[0_10px_30px_rgba(232,96,42,0.3)] disabled:opacity-70 disabled:bg-[#E8602A]/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Processing..." : "Pay Securely & Submit"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
                   <CheckCircle2 className="w-12 h-12 text-green-600" />
                 </motion.div>
               </div>
               <h2 className="text-3xl font-bold font-syne text-[#0F0F0F] mb-4">Case Submitted Successfully</h2>
               <p className="text-gray-600 mb-8 max-w-md mx-auto">
                 Your case has been securely logged. Our paralegals have been notified and will review your documents within 24 hours.
               </p>
               
               <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 mb-10 font-mono text-sm">
                 <span className="text-gray-400 uppercase tracking-widest text-xs block mb-1">Case Tracker ID</span>
                 <span className="font-bold text-lg">{createdCaseId?.split('-')[0].toUpperCase() || "KD-0000"}</span>
               </div>

               <div>
                 <Link href={`/dashboard/cases/${createdCaseId}`}>
                   <Button className="bg-[#E8602A] text-white hover:bg-[#ff7a45] font-bold h-12 px-8">
                     Track Case Status <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                 </Link>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
