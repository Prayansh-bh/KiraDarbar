"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Shield, 
  Settings, 
  LogOut,
  PlusCircle,
  Home,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/login/actions";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Cases", href: "/dashboard/cases", icon: Briefcase },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Shield Status", href: "/dashboard/subscription", icon: Shield },
  { name: "Settings", href: "/dashboard/profile", icon: Settings },
];

const MOBILE_NAV = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Cases", href: "/dashboard/cases", icon: Briefcase },
  { name: "Docs", href: "/dashboard/documents", icon: FileText },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUser(user);

      const { data: profileData } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();
      setProfile(profileData);
    };
    checkUser();
  }, [supabase, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex font-dm-sans">

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-80 bg-black text-surface flex-col transition-transform duration-300 ease-in-out relative">
        <div className="flex flex-col h-full p-8 border-r border-white/5">
          <div className="flex items-center gap-3 mb-12 select-none whitespace-nowrap">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-[#E8602A]/20 border border-white/10">
              <Image src="/logo.png" alt="KiraDarbar Logo" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <span className="text-xl lg:text-2xl font-black font-syne italic tracking-tighter text-white shrink-0">
              <span className="text-white">Kira</span>
              <span className="text-[#E8602A] ml-1">Darbar</span>
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold italic transition-all duration-300
                    ${isActive ? "bg-[#E8602A] text-white shadow-[0_10px_20px_rgba(232,96,42,0.2)]" : "hover:bg-white/5 text-gray-400 hover:text-white"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  {item.name === "Shield Status" && (
                     <span className="text-[10px] font-black italic uppercase tracking-widest bg-[#2A1208] text-[#E8602A] px-2 py-0.5 rounded-full border border-[#E8602A]/20">
                       PRO
                     </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 border-t border-white/5 space-y-4">
            <Link href="/dashboard/cases/new">
              <Button className="w-full h-14 font-black italic bg-[#8B3114] hover:bg-[#6D260F] text-white flex items-center justify-center gap-2 rounded-xl transition-all shadow-[0_10px_30px_rgba(139,49,20,0.2)]">
                <PlusCircle className="w-5 h-5" />
                New Case
              </Button>
            </Link>
            <button 
              onClick={() => logout()}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold italic text-white/20 hover:text-error transition-colors w-full group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-[72px] lg:pb-0 h-screen overflow-hidden">
        <header className="h-20 bg-[#0F0F0F] border-b border-white/5 px-6 md:px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold font-syne text-white italic tracking-tight">
              User Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs font-black text-white">{profile?.full_name || user.user_metadata?.full_name || user.email}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest leading-none mt-1 ${profile?.plan === 'shield' ? 'text-[#D4A017]' : 'text-gray-500'}`}>
                {profile?.plan === 'shield' ? 'Shield Pro Member' : 'Free Tenant'}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#1A1A1A] text-[#E8602A] rounded-full flex items-center justify-center font-black italic border border-[#E8602A]/20 shadow-xl overflow-hidden group">
               <span className="group-hover:text-white transition-colors">{(user.email?.[0] || 'U').toUpperCase()}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 selection:bg-[#E8602A]/20 selection:text-[#E8602A]">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-white/5 flex items-center justify-between px-2 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        {MOBILE_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`
                flex flex-col items-center justify-center w-full py-3 gap-1 relative overflow-hidden transition-colors
                ${isActive ? "text-[#E8602A]" : "text-gray-500 hover:text-gray-300"}
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'fill-[#E8602A]/20' : ''}`} />
              <span className="text-[10px] font-bold tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
