"use client";

import { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, AlertCircle, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data.session) {
      // Check if user has a profile, if not redirect to signup complete profile flow
      const { data: profile } = await supabase.from('users').select('full_name').eq('id', data.user?.id).single();
      if (!profile?.full_name) {
        router.push("/signup?step=profile");
      } else {
        router.push(nextPath);
      }
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
          Welcome back.
        </div>
        <p className="text-sm text-gray-500 font-medium">Access your protected tenant dashboard.</p>
      </div>

      <Card className="bg-[#1A1A1A] border-white/10 shadow-2xl overflow-hidden">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.form 
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin} 
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
                <label className="text-sm font-bold text-gray-300">Password</label>
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
                {loading ? "Authenticating..." : "Login"} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                New to KiraDarbar? <br/><Link href="/signup" className="text-[#E8602A] hover:underline">Create an account</Link>
              </p>
            </motion.form>
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center text-gray-600 gap-2 text-xs font-mono">
        <ShieldCheck className="w-4 h-4" /> Secure 256-bit AES Encryption
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] font-dm-sans flex flex-col items-center justify-center p-6 selection:bg-[#E8602A]/20">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E8602A] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Connecting...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
