"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  FileText,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Problem", description: "What happened?" },
  { id: 2, title: "Landlord", description: "Who is it against?" },
  { id: 3, title: "Evidence", description: "Agreement & Proof" },
  { id: 4, title: "Review", description: "Final check" }
];

const CASE_TYPES = [
  { id: "deposit_recovery", label: "Security Deposit Theft", icon: "₹" },
  { id: "legal_notice", label: "Illegal Eviction Threat", icon: "🚫" },
  { id: "maintenance_issue", label: "Unfair Maintenance/Repairs", icon: "🛠️" },
  { id: "rights_check", label: "Other Harassment", icon: "⚖️" }
];

export default function FileNoticePage() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    caseType: "",
    title: "",
    description: "",
    amount: "",
    landlordName: "",
    landlordPhone: "",
    landlordAddress: "",
    propertyAddress: "",
    files: [] as File[]
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase]);

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ 
        ...prev, 
        files: [...prev.files, ...Array.from(e.target.files!)] 
      }));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push("/login?returnUrl=/file-notice");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Case record
      const { data: caseData, error: caseError } = await supabase
        .from("cases")
        .insert({
          user_id: user.id,
          case_type: formData.caseType,
          title: formData.title,
          description: formData.description,
          landlord_name: formData.landlordName,
          landlord_phone: formData.landlordPhone,
          landlord_address: formData.landlordAddress,
          property_address: formData.propertyAddress,
          amount_disputed: parseFloat(formData.amount) || 0,
          status: "submitted"
        })
        .select()
        .single();

      if (caseError) throw caseError;

      // 2. Upload Files (if any)
      for (const file of formData.files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${caseData.id}/${Math.random()}.${fileExt}`;
        const filePath = `cases/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("case-documents")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        await supabase.from("documents").insert({
          case_id: caseData.id,
          user_id: user.id,
          file_name: file.name,
          storage_path: filePath,
          file_type: file.type
        });
      }

      router.push(`/dashboard/cases/${caseData.id}?status=submitted`);
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-brand/40 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="p-2 hover:bg-accent/20 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-syne text-secondary italic">Case Filing <span className="text-primary italic">Portal</span></h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
            Step {step} of 4
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 pb-32">
        {/* Inline Error Banner */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-700 flex-1">{errorMsg}</p>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
          </div>
        )}
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((s) => (
            <div 
              key={s.id} 
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                step >= s.id ? "bg-primary" : "bg-border-brand/20"
              }`}
            />
          ))}
        </div>

        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-syne text-secondary italic uppercase tracking-tight underline decoration-primary decoration-4 underline-offset-4">Identify the Problem</h2>
                  <p className="text-text-secondary font-medium">Select what describes your situation best.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CASE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, caseType: type.id }))}
                      className={`p-6 rounded-card border-2 text-left transition-all group ${
                        formData.caseType === type.id 
                          ? "border-primary bg-primary/5 shadow-card" 
                          : "border-border-brand/40 bg-white hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">{type.icon}</span>
                        {formData.caseType === type.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
                      </div>
                      <div className="font-bold text-secondary text-lg font-syne italic">{type.label}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title</Label>
                    <Input 
                      id="title"
                      name="title"
                      placeholder="e.g. Landlord refusing to return 2 months deposit"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Disputed Amount (₹)</Label>
                    <Input 
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="e.g. 85000"
                      value={formData.amount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Full Context</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      placeholder="Explain exactly what happened, including dates and any specific threats made by the landlord."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-syne text-secondary italic uppercase tracking-tight underline decoration-primary decoration-4 underline-offset-4">Landlord & Property</h2>
                  <p className="text-text-secondary font-medium">We need this to address the legal notice correctly.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="landlordName">Landlord Full Name</Label>
                    <Input 
                      id="landlordName"
                      name="landlordName"
                      placeholder="As per agreement"
                      value={formData.landlordName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landlordPhone">Landlord Phone (WhatsApp preferred)</Label>
                    <Input 
                      id="landlordPhone"
                      name="landlordPhone"
                      placeholder="+91"
                      value={formData.landlordPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landlordAddress">Landlord&apos;s Permanent Address</Label>
                  <Textarea 
                    id="landlordAddress"
                    name="landlordAddress"
                    placeholder="This is where the physical notice will be sent"
                    value={formData.landlordAddress}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2 border-t border-border-brand/20 pt-8">
                  <Label htmlFor="propertyAddress">The Rented Property Address</Label>
                  <Textarea 
                    id="propertyAddress"
                    name="propertyAddress"
                    placeholder="Complete address of the flat/house you are/were living in"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-syne text-secondary italic uppercase tracking-tight underline decoration-primary decoration-4 underline-offset-4">Evidence Base</h2>
                  <p className="text-text-secondary font-medium">Upload documents that back your claim.</p>
                </div>

                <Card className="border-2 border-dashed border-border-brand/60 bg-white hover:border-primary transition-colors cursor-pointer group relative overflow-hidden">
                  <CardContent className="p-12 text-center space-y-4">
                    <input 
                      type="file" 
                      multiple 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileUpload}
                    />
                    <div className="w-16 h-16 bg-accent/20 text-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold font-syne text-secondary">Click to upload or drag & drop</p>
                      <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Agreement, Receipts, WhatsApp Chats (Max 10MB)</p>
                    </div>
                  </CardContent>
                </Card>

                {formData.files.length > 0 && (
                  <div className="space-y-3">
                    <Label>Selected Files ({formData.files.length})</Label>
                    <div className="grid gap-2">
                      {formData.files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-border-brand/40 rounded-btn">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="text-sm font-bold text-secondary truncate max-w-[200px]">{file.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-text-muted uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-syne text-secondary italic uppercase tracking-tight underline decoration-primary decoration-4 underline-offset-4">Review & Submit</h2>
                  <p className="text-text-secondary font-medium">Verify your details before initiating the legal process.</p>
                </div>

                <div className="grid gap-6">
                  <Card className="bg-white border-2 border-border-brand/40 shadow-card overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-secondary p-4 flex items-center justify-between">
                        <span className="text-xs font-black text-surface uppercase tracking-widest">Case Summary</span>
                        <span className="text-xs font-black text-primary uppercase tracking-widest">{formData.caseType.replace("_", " ")}</span>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[10px] text-text-muted">Issue</Label>
                            <div className="text-sm font-bold text-secondary">{formData.title || "Untitled Issue"}</div>
                          </div>
                          <div>
                            <Label className="text-[10px] text-text-muted">Claim Amount</Label>
                            <div className="text-sm font-black text-primary italic text-lg">₹{formData.amount || "0"}</div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-[10px] text-text-muted">Landlord</Label>
                          <div className="text-sm font-bold text-secondary">{formData.landlordName || "N/A"} ({formData.landlordPhone || "N/A"})</div>
                        </div>
                        <div>
                          <Label className="text-[10px] text-text-muted">Property</Label>
                          <div className="text-sm font-bold text-secondary leading-relaxed">{formData.propertyAddress || "N/A"}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-accent/10 border border-accent/20 rounded-btn p-4 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-secondary flex-shrink-0" />
                    <p className="text-xs font-medium text-secondary/80 leading-relaxed">
                      By submitting, you agree that KiraDarbar will draft a legal notice based on these facts. 
                      Intentional misrepresentation may lead to rejection of the case.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-border-brand/40 px-6 py-6 pb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="h-14 px-8 font-black font-syne italic uppercase tracking-tighter"
            >
              Back
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              onClick={nextStep}
              disabled={step === 1 && !formData.caseType}
              className="h-14 flex-1 font-black font-syne italic text-lg uppercase tracking-tighter group"
            >
              Continue to {STEPS[step].title}
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="h-14 flex-1 font-black font-syne italic text-lg uppercase tracking-tighter bg-secondary text-surface hover:bg-secondary/90 shadow-elevated"
            >
              {loading ? (
                "Processing Case..."
              ) : user ? (
                <>
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  File My Notice • ₹799
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Login to File Notice
                </>
              )}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
