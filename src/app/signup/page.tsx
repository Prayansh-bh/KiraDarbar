"use client";

import { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, AlertCircle, Lock, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { CITY_STATE_MAP, CITIES } from "@/utils/locations";


function SignupForm() {
  const searchParams = useSearchParams();
  // We can force the profile step if redirected from /login
  const initialStep = searchParams.get("step") === "profile" ? "profile" : "phone";
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  
  const [step, setStep] = useState<"credentials" | "profile">(initialStep === "profile" ? "profile" : "credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    if (CITY_STATE_MAP[selectedCity]) {
      setState(CITY_STATE_MAP[selectedCity]);
    }
  };
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // resendTimer logic removed as OTP is no longer used
  }, []);

  const validateProfile = () => {
    if (fullName.length < 2 || fullName.length > 60) return "Name must be between 2 and 60 characters.";
    if (!/^[a-zA-Z\s]+$/.test(fullName)) return "Name can only contain letters and spaces.";
    if (!city) return "Please select a city.";
    if (!state) return "Please enter your state.";
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    if (!supabase) {
      setLoading(false);
      setError("System Configuration Error: Supabase keys are missing. Please add them to your Vercel project settings.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data.user) {
      // If user is returned, even if email is unconfirmed, we proceed to profile step
      setStep("profile");
    }
  };

  // handleVerifyOtp removed

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateProfile();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    
    if (!supabase) {
      setLoading(false);
      setError("System Configuration Error: Supabase keys are missing. Please add them to your Vercel project settings.");
      return;
    }
    
    // Auth session should exist here because they verified OTP
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      setError("Authentication lost. Please try logging in again.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.from('users').upsert({
      id: userId,
      full_name: fullName,
      city,
      state,
    });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-8"
    >
      <div className="text-center space-y-2 mb-8">
        <div className="text-4xl font-bold font-syne text-white tracking-tight">
          {step === "profile" ? "Almost there." : "Claim your shield."}
        </div>
        <p className="text-sm text-gray-500 font-medium">
          {step === "profile" ? "We need a few details to personalize your legal notices." : "Join thousands of protected tenants across India."}
        </p>
      </div>

      <Card className="bg-[#1A1A1A] border-white/10 shadow-2xl overflow-hidden">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {step === "credentials" && (
              <motion.form 
                key="signup-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSignup} 
                className="space-y-6"
              >
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">Email Address</label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className="bg-[#111] border-white/10 text-white h-12 focus-visible:ring-[#E8602A] placeholder:opacity-30"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">Choose Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10 bg-[#111] border-white/10 text-white h-12 focus-visible:ring-[#E8602A] placeholder:opacity-30"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={loading || email.length < 5 || password.length < 6}
                  className="w-full h-12 bg-[#E8602A] hover:bg-[#D4501D] text-white font-bold text-lg"
                >
                  {loading ? "Creating Account..." : "Sign Up"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                  Already have an account? <br/><Link href="/login" className="text-[#E8602A] hover:underline">Log in here</Link>
                </p>
              </motion.form>
            )}

            {step === "profile" && (
              <motion.form 
                key="profile-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCompleteProfile} 
                className="space-y-5"
              >
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Singh" 
                      className="pl-10 bg-[#111] border-white/10 text-white h-12 focus-visible:ring-[#E8602A]"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      value={city}
                      onChange={handleCityChange}
                      className="w-full pl-10 bg-[#111] border border-white/10 text-white h-12 rounded-md focus:ring-2 focus:ring-[#E8602A] outline-none appearance-none"
                      disabled={loading}
                    >
                      <option value="" disabled>Select your city...</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">State</label>
                  <Input 
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State will be auto-selected" 
                    className="bg-[#111] border-white/10 text-white h-12 focus-visible:ring-[#E8602A] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !!city}
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold text-lg mt-4"
                >
                  {loading ? "Saving..." : "Start Shielding Dashboard"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center text-gray-600 gap-2 text-xs font-mono">
        <ShieldCheck className="w-4 h-4" /> Secure 256-bit AES Encryption
      </div>
    </motion.div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] font-dm-sans flex flex-col items-center justify-center p-6 selection:bg-[#E8602A]/20">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E8602A] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Connecting...</p>
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
