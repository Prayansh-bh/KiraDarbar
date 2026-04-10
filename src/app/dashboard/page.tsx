"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  PlusCircle, 
  Search, 
  Shield 
} from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => {
  const { ref, count } = useCountUp({ from: 0, to: value, duration: 1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="bg-[#1A1A1A] border-white/5 shadow-none overflow-hidden group hover:border-white/10 transition-all duration-500 rounded-2xl h-full">
        <CardContent className="p-8 relative h-full flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: color }}></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">{title}</p>
              <div className="text-4xl font-bold font-syne text-white tracking-tighter">{count}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: `${color}15` }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeCases: 0, docsUploaded: 0 });
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const [
        { data: userData },
        { data: cases, count: caseCount },
        { count: docCount }
      ] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('cases').select('*', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('documents').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      setProfile(userData);
      setRecentCases(cases || []);
      
      const activeCasesCount = (cases || []).filter(c => !['resolved', 'closed'].includes(c.status)).length;
      setStats({
        activeCases: activeCasesCount,
        docsUploaded: docCount || 0
      });

      setLoading(false);
    }
    loadDashboard();
  }, [router, supabase.auth, supabase]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-white/5 text-gray-300 border-white/10';
      case 'under_review': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'closed': return 'bg-white/5 text-gray-500 border-gray-800';
      default: return 'bg-white/5 text-gray-300 border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-1/3 bg-gray-200 rounded-lg"></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black font-syne italic text-white tracking-tighter">
          {greeting()}, {profile?.full_name?.split(' ')[0] || 'Tenant'}.
        </h1>
        <p className="text-[#999] mt-2 font-medium">Here's your case summary and active protection status.</p>
      </motion.div>

      {/* Subscription Banner for Pro vs Free */}
      {profile?.plan === 'shield' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] p-8 md:p-10 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_40px_100px_rgba(0,0,0,0.2)] relative overflow-hidden group"
        >
          {/* Animated Background Orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          
          <div className="flex items-center gap-8 text-white relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center shrink-0 border border-white/20 rotate-3 group-hover:rotate-0 transition-all duration-700 shadow-2xl">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8602A]/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#E8602A] mb-3 backdrop-blur-sm border border-[#E8602A]/20">
                Shield Pro Member
              </div>
              <h3 className="font-bold font-syne text-3xl italic tracking-tighter leading-tight">Your Rights, Shielded.</h3>
              <p className="text-white/50 text-base mt-2 max-w-lg leading-relaxed">Access unlimited legal reviews, priority case handling, and 24/7 paralegal support.</p>
            </div>
          </div>
          <Link href="/dashboard/subscription" className="w-full md:w-auto shrink-0 relative z-10">
            <Button className="w-full bg-white text-black hover:bg-gray-200 font-black italic uppercase tracking-tighter h-14 px-10 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
              Manage Protection
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] p-8 md:p-10 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl group border-l-4 border-l-primary/30"
        >
          <div className="flex items-center gap-8 text-white">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold font-syne text-2xl tracking-tight">Upgrade to Shield Protection</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-md">Get full-year legal coverage, priority filing, and unlimited document reviews.</p>
            </div>
          </div>
          <Link href="/dashboard/subscription" className="w-full md:w-auto shrink-0">
            <Button className="w-full bg-[#E8602A] hover:bg-[#ff7a45] text-white font-black italic h-14 px-10 rounded-xl uppercase tracking-tighter">
              Upgrade Now
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Cases" 
          value={stats.activeCases} 
          icon={Briefcase} 
          color="#E8602A" 
          delay={0.1}
        />
        <StatCard 
          title="Documents Uploaded" 
          value={stats.docsUploaded} 
          icon={FileText} 
          color="#D4A017" 
          delay={0.2}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`border-l-4 shadow-none h-full bg-[#1A1A1A] rounded-2xl ${profile?.plan === 'shield' ? 'border-l-green-500 border-t border-r border-b border-white/5' : 'border-l-gray-600 border-t border-r border-b border-white/5'}`}>
            <CardContent className="p-6 h-full flex flex-col justify-center">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Subscription Status</p>
                  <div className="text-2xl font-bold font-syne text-white uppercase mt-2">
                    {profile?.plan === 'shield' ? 'Shield Pro' : 'Free Tenant'}
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile?.plan === 'shield' ? 'bg-green-500/10' : 'bg-white/5'}`}>
                  <ShieldCheck className={`w-5 h-5 ${profile?.plan === 'shield' ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Recent Cases */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-syne italic text-white tracking-tight">Recent Cases</h2>
            <Link href="/dashboard/cases">
              <Button variant="ghost" size="sm" className="text-primary font-black italic">View all</Button>
            </Link>
          </div>

          <Card className="bg-[#161616] border-white/5 shadow-none rounded-2xl">
            {recentCases.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="font-medium text-gray-400">No cases filed yet.</p>
                <Link href="/dashboard/cases/new">
                  <Button variant="link" className="text-[#E8602A] mt-2 font-bold hover:text-white">File your first case</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentCases.map((c, i) => (
                  <motion.div 
                    key={c.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-white text-lg line-clamp-1">{c.title}</h4>
                      <p className="text-sm text-gray-400 line-clamp-1 mt-1 capitalize">{c.case_type.replace('_', ' ')}</p>
                    </div>
                    <Link href={`/dashboard/cases/${c.id}`} className="w-full sm:w-auto shrink-0">
                      <Button variant="outline" size="sm" className="w-full group bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                        View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black font-syne italic text-white tracking-tight">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/cases/new?type=legal_notice" className="block">
              <div className="bg-[#1A1A1A] text-white p-6 rounded-xl border border-white/5 hover:border-[#E8602A]/50 hover:bg-[#222] transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-[#E8602A]" />
                  <span className="font-bold">File Legal Notice</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#E8602A] transition-colors" />
              </div>
            </Link>

            <Link href="/dashboard/cases/new?type=agreement_review" className="block">
              <div className="bg-[#1A1A1A] text-white p-6 rounded-xl border border-white/5 hover:border-blue-500/50 hover:bg-[#222] transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-white">Review Agreement</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>

             <Link href="/rights" className="block">
              <div className="bg-[#1A1A1A] text-white p-6 rounded-xl border border-white/5 hover:border-[#D4A017]/50 hover:bg-[#222] transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#D4A017]" />
                  <span className="font-bold text-white">Check My Rights</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#D4A017] transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
