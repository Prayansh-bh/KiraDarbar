"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  AlertTriangle,
  DoorClosed,
  TrendingUp,
  Search,
  Shield,
  Star,
  Gavel,
  FileText,
  Check,
  Lock,
  Menu
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Counter = ({ from, to, duration, prefix = "", suffix = "", isFloat = false }: any) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      const node = nodeRef.current;
      import("framer-motion").then(({ animate }) => {
        animate(Number(from), Number(to), {
          duration,
          ease: "easeOut",
          onUpdate(value) {
            if (node) {
              const formatted = isFloat ? Number(value).toFixed(1) : Math.floor(Number(value)).toLocaleString('en-IN');
              node.textContent = `${prefix}${formatted}${suffix}`;
            }
          },
        });
      });
    }
  }, [from, to, duration, inView, prefix, suffix, isFloat]);

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
};

export default function HomeClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // For How it Works section dashed line
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"]
  });

  const dashOffset = useTransform(scrollYProgress, [0, 1], [1000, 0]);

  // Block 4: Word by word string array
  const headlineWords = "Your landlord has a lawyer. Now you do too.".split(" ");

  return (
    <div className="flex flex-col min-h-screen font-dm-sans bg-[#0F0F0F] selection:bg-[#E8602A]/20 selection:text-[#E8602A] scroll-smooth relative overflow-x-hidden">
      
      {/* Top Banner Ticker */}
      <div className="bg-[#1A1A1A] text-white py-2 overflow-hidden border-b border-white/5 hidden sm:block">
        <div className="flex whitespace-nowrap animate-marquee">
          {[
            "₹55,000 Recovered in HSR Layout, Bengaluru",
            "Signed Notice Sent to Landlord in Powai, Mumbai",
            "Security Deposit Settlement Reached (₹1.2L) - Gurgaon",
            "Illegal Eviction Halted in Indiranagar",
            "₹30,000 Maintenance Dispute Resolved in Noida",
          ].map((text, i) => (
            <span key={i} className="inline-flex items-center mx-8 text-[10px] font-black uppercase tracking-[0.2em] italic">
              <CheckCircle2 className="w-3 h-3 text-[#E8602A] mr-2" />
              {text}
            </span>
          ))}
          {[
             "₹55,000 Recovered in HSR Layout, Bengaluru",
             "Signed Notice Sent to Landlord in Powai, Mumbai",
             "Security Deposit Settlement Reached (₹1.2L) - Gurgaon",
          ].map((text, i) => (
            <span key={i+10} className="inline-flex items-center mx-8 text-[10px] font-black uppercase tracking-[0.2em] italic">
              <CheckCircle2 className="w-3 h-3 text-[#E8602A] mr-2" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-[#E8602A]/20 border border-white/10">
            <Image src="/logo.png" alt="KiraDarbar Logo" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black font-syne text-white tracking-tighter">
            Kira<span className="text-[#E8602A] italic">Darbar</span>
          </span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-white uppercase tracking-tight">
          <Link href="#how-it-works" className="hover:text-[#E8602A] transition-colors relative group focus:outline-none focus:ring-2 focus:ring-[#E8602A] rounded px-1">
            How it Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E8602A] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/rights" className="hover:text-[#E8602A] transition-colors relative group focus:outline-none focus:ring-2 focus:ring-[#E8602A] rounded px-1">
            Free Check
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E8602A] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#pricing" className="hover:text-[#E8602A] transition-colors relative group focus:outline-none focus:ring-2 focus:ring-[#E8602A] rounded px-1">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E8602A] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/login" className="bg-white text-black px-6 py-2.5 rounded hover:bg-gray-200 transition-all shadow-sm transform hover:translate-x-1 duration-200">Login</Link>
        </div>
        
        {/* Mobile Nav Hamburger Placeholder */}
        <div className="md:hidden flex">
          <Button variant="ghost" onClick={() => setMobileMenuOpen(true)} className="text-white hover:bg-white/10 p-2 h-auto">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0F0F0F] flex flex-col pt-20 px-6">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-white p-2">✕</button>
          <div className="flex flex-col gap-8 text-2xl font-syne font-bold text-white">
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>
            <Link href="/rights" onClick={() => setMobileMenuOpen(false)}>Free Check</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#E8602A]">Login</Link>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* BLOCK 4: HERO SECTION - Stacked on mobile */}
        <section className="relative min-h-[90vh] flex items-center bg-[#0F0F0F] overflow-hidden pt-12 lg:pt-0">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none hero-grain filter blur-[0.5px]"></div>
          <div className="absolute -bottom-32 -right-32 w-1/2 h-[10px] bg-gradient-to-r from-transparent via-[#E8602A] to-transparent transform -rotate-45 opacity-20"></div>

          <div className="max-w-7xl w-full mx-auto px-6 py-10 lg:py-20 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            {/* Left Content (55%) */}
            <div className="w-full lg:w-[55%] space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Badge */}
              <motion.div 
                initial={mounted ? { opacity: 0, x: -20 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8602A]/10 border border-[#E8602A]/30 rounded-full text-[#E8602A] text-sm font-semibold hover:bg-[#E8602A]/20 transition-colors"
               >
                <span>🏛</span> India&apos;s First Tenant Protection Service
              </motion.div>

              {/* Headline */}
              <h1 className="text-[40px] leading-tight lg:text-[64px] font-bold font-syne text-white lg:leading-[1.05] tracking-tight">
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={mounted ? { opacity: 0, y: 30 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.06,
                      ease: "easeOut"
                    }}
                    className="inline-block mr-2 lg:mr-4 last:mr-0"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              {/* Subheadline */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-lg lg:text-[20px] text-[#999] max-w-xl font-dm-sans leading-relaxed"
              >
                Stop losing your deposit. Stop tolerating illegal evictions. KiraDarbar sends legally binding notices, reviews your rent agreements, and stands in your corner — starting at ₹799.
              </motion.p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                  className="w-full sm:w-auto"
                >
                  <Link href="/dashboard/cases/new">
                    <Button className="w-full sm:w-auto h-[54px] lg:h-[48px] px-8 bg-[#E8602A] hover:bg-[#ff7a45] text-white text-lg font-bold rounded shadow-lg transition-all focus:ring-4 focus:ring-[#E8602A]/50 flex items-center justify-center group overflow-hidden">
                      Send a Legal Notice
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.3 }}
                  className="w-full sm:w-auto"
                >
                  <Link href="/rights">
                    <Button variant="outline" className="w-full sm:w-auto h-[54px] lg:h-[48px] px-8 bg-transparent border-white/30 text-white text-lg font-medium hover:bg-white/5 hover:border-white rounded transition-all focus:ring-4 focus:ring-white/20 group flex justify-center">
                      Check Your Rights Free <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Trust Bar */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="pt-8 border-t border-white/10 text-sm font-semibold text-[#888] flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mt-4 w-full"
              >
                <span><Counter from={0} to={4200} duration={2} suffix="+" /> tenants protected</span>
                <span className="hidden sm:inline">•</span>
                <span>₹<Counter from={0} to={3.8} duration={2} isFloat={true} /> Cr+ recovered</span>
                <span className="hidden sm:inline">•</span>
                <span><Counter from={0} to={96} duration={1.5} suffix="%" /> rate</span>
              </motion.div>
            </div>

            {/* Right Visual (45%) */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[45%] relative h-[450px] lg:h-[600px] flex items-center justify-center transform lg:scale-100 scale-90 sm:w-[80%] mx-auto mt-8 lg:mt-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,96,42,0.15),transparent_50%)] pointer-events-none"></div>

              {/* Floaty Notice Mockup */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[320px] lg:w-[380px] h-[450px] bg-white rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col transform rotate-1"
               >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div className="text-xl font-bold font-syne text-gray-900 tracking-tight">Kira<span className="text-[#E8602A] italic">Darbar</span>.</div>
                  <div className="text-[10px] text-gray-400 font-mono text-right">REF: KD-492<br/>STRICTLY CONFIDENTIAL</div>
                </div>
                {/* Body */}
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="w-16 h-16 border-[3px] border-red-600/80 rounded-full flex items-center justify-center absolute top-20 right-6 opacity-30 transform -rotate-12 pointer-events-none">
                    <span className="text-red-600/80 font-bold text-[8px] uppercase tracking-widest text-center leading-tight">LEGAL<br/>NOTICE</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-2.5 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-2.5 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="space-y-2 mt-4 opacity-50 font-jetbrains-mono text-[8px] text-gray-800 leading-[1.8] blur-[0.5px]">
                    <p>SUBJECT: NOTICE TO REFUND SECURITY DEPOSIT UNDER SECTION 108 OF TRANSFER OF PROPERTY ACT, 1882.</p>
                    <p>Under instructions from and on behalf of my client, Sri/Smt. Tenant Name, residing at the aforementioned address, I hereby serve you with this legal notice.</p>
                    <p>That pursuant to the Leave and License agreement dated 14th June 2023, my client has deposited a sum of Rs. 1,00,000/-...</p>
                  </div>
                  
                  <div className="space-y-2 mt-auto text-xs border-l-4 border-[#E8602A] pl-4">
                    <div className="font-bold text-gray-800 font-syne text-lg italic signature-font">Adv. R. K. Sharma</div>
                    <div className="text-gray-500 font-mono text-[9px]">ENROLLMENT NO: MAH/1029/2012</div>
                  </div>
                </div>
              </motion.div>

              {/* Orbiting Badges */}
              <motion.div 
                 initial={{ opacity: 0, x: -20, y: 10 }} animate={{ opacity: 1, x: 0, y: [0, -6, 0] }} transition={{ opacity: { delay: 0.8, duration: 0.6 }, y: { delay: 0.8, duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute top-1/4 -left-8 lg:-left-16 bg-white border border-gray-100 shadow-xl px-4 py-2 rounded-full flex items-center gap-2 z-20"
              >
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-green-600" /></div>
                <span className="text-xs font-bold text-gray-800">Lawyer Signed</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20, y: 20 }} animate={{ opacity: 1, x: 0, y: [0, -8, 0] }} transition={{ opacity: { delay: 1.0, duration: 0.6 }, y: { delay: 1.0, duration: 3.5, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute top-1/2 -right-4 lg:-right-12 bg-white border border-gray-100 shadow-xl px-4 py-2 rounded-full flex items-center gap-2 z-20"
              >
                <div className="w-5 h-5 bg-[#E8602A]/10 rounded-full flex items-center justify-center"><FileText className="w-3 h-3 text-[#E8602A]" /></div>
                <span className="text-xs font-bold text-gray-800">Sent via Post</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: [0, -5, 0] }} transition={{ opacity: { delay: 1.2, duration: 0.6 }, y: { delay: 1.2, duration: 2.8, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute -bottom-6 left-1/4 bg-[#111] border border-white/20 shadow-xl px-4 py-2 rounded-full flex items-center gap-2 z-20"
              >
                <Gavel className="w-4 h-4 text-[#D4A017]" />
                <span className="text-xs font-bold text-white">Legally Binding</span>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* BLOCK 5: THE PROBLEM */}
        <section className="py-24 bg-[#111111] relative z-10">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center md:text-left mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-syne text-white tracking-tight mb-2">Every renter has faced this.</h2>
              <p className="text-xl text-[#888] font-medium">You know exactly which one.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { i: AlertTriangle, t: "₹80,000 deposit vanished", d: "Landlord found 'damage' that didn't exist." },
                { i: DoorClosed, t: "Evicted with 3 days notice", d: "No notice period. No reason. Just out." },
                { i: TrendingUp, t: "Rent hiked 40% overnight", d: "No clause. No warning. Take it or leave." },
                { i: Lock, t: "Locked out of your own home", d: "Came back from work. Locks changed." },
              ].map((card, idx) => {
                const Icon = card.i as any;
                return (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                  key={idx} 
                  className="bg-[#1A1A1A] border-l-4 border-[#E8602A] p-8 rounded-r-xl shadow-lg border-y border-r border-white/5 flex flex-col justify-center"
                >
                  <Icon className="w-8 h-8 text-[#E8602A] mb-4 stroke-[1.5]" />
                  <h3 className="text-xl font-bold text-white mb-2">{card.t}</h3>
                  <p className="text-[#999]">{card.d}</p>
                </motion.div>
              )})}
            </div>

            <div className="mt-12 text-center md:text-left">
              <p className="text-[#666] italic text-lg max-w-2xl">
                "If any of these happened to you, you have legal rights. Most landlords count on you not knowing that."
              </p>
            </div>
          </div>
        </section>

        {/* BLOCK 5: SERVICES */}
        <section className="py-28 bg-[#FAF7F2] text-[#111]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-4xl md:text-5xl font-bold font-syne text-[#0F0F0F] text-center mb-16 tracking-tight"
            >
              What KiraDarbar does for you.
            </motion.h2>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Service 1 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-[#E8602A]/10 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-[#E8602A]/20">
                  <Gavel className="w-7 h-7 text-[#E8602A]" />
                </div>
                <h3 className="text-2xl font-bold font-syne text-[#0F0F0F] mb-4">Send a Legal Notice</h3>
                <p className="text-[#555] mb-8 leading-relaxed flex-1">
                  A lawyer-signed notice dispatched to your landlord. Most landlords back down the moment they receive it. Covers deposit theft, illegal eviction, harassment, and lockouts.
                </p>
                <div className="font-bold text-[#0F0F0F] text-xl mb-4">₹799</div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded text-red-600">Most popular</span>
                </div>
                <Link href="/signup?redirect=/dashboard/cases/new?type=legal_notice">
                  <Button className="w-full bg-[#111] hover:bg-[#333] text-white">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </Link>
              </motion.div>

              {/* Service 2 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.30, duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-blue-100">
                  <Search className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold font-syne text-[#0F0F0F] mb-4">Review Your Rent Agreement</h3>
                <p className="text-[#555] mb-8 leading-relaxed flex-1">
                  Upload your agreement before signing. We flag every clause that's illegal, unfair, or designed to trap you — in plain Hindi/English.
                </p>
                <div className="font-bold text-[#0F0F0F] text-xl mb-4">₹499</div>
                <div className="flex items-center gap-2 mb-6 opacity-0">...</div>
                <Link href="/signup?redirect=/dashboard/cases/new?type=agreement_review">
                  <Button className="w-full bg-[#111] hover:bg-[#333] text-white">Review My Agreement <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </Link>
              </motion.div>

              {/* Service 3 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="bg-[#1A1A1A] p-8 rounded-2xl shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 border-2 border-[#D4A017] flex flex-col text-white relative overflow-hidden group hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 bg-[#D4A017] text-[#111] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Best Value</div>
                <div className="w-14 h-14 bg-[#D4A017]/20 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-[#D4A017]/30">
                  <Shield className="w-7 h-7 text-[#D4A017]" />
                </div>
                <h3 className="text-2xl font-bold font-syne text-white mb-4">Shield Subscription</h3>
                <p className="text-[#CCC] mb-8 leading-relaxed flex-1">
                  Ongoing protection. One notice per year, unlimited agreement reviews, priority case support, and deposit recovery help — all year round.
                </p>
                <div className="font-bold text-[#D4A017] text-xl mb-4">₹199 <span className="text-sm font-medium text-[#888]">/mo</span></div>
                <div className="flex items-center gap-2 mb-6 opacity-0">...</div>
                <Link href="/signup?redirect=/dashboard/subscription">
                  <Button className="w-full bg-[#D4A017] hover:bg-[#B8860B] text-[#111] font-bold">Subscribe <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* BLOCK 5: HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-white overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-4xl md:text-5xl font-bold font-syne text-center mb-24 tracking-tight"
            >
              From dispute to resolution in 3 steps.
            </motion.h2>
            
            <div className="relative" ref={stepsRef}>
              {/* Dashed line Desktop */}
              <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] z-0 pointer-events-none">
                <motion.svg width="100%" height="2" className="absolute w-full">
                  <motion.line 
                    x1="0" y1="1" x2="100%" y2="1" 
                    stroke="#E8602A" 
                    strokeWidth="2" 
                    strokeDasharray="8 8" 
                    style={{ strokeDashoffset: dashOffset }} 
                  />
                </motion.svg>
              </div>

              {/* Dashed line Mobile */}
              <div className="block md:hidden absolute top-0 bottom-0 left-[34px] w-[2px] z-0 pointer-events-none">
                <motion.svg width="2" height="100%" className="absolute h-[80%]">
                  <motion.line 
                    x1="1" y1="0" x2="1" y2="100%" 
                    stroke="#E8602A" 
                    strokeWidth="2" 
                    strokeDasharray="8 8" 
                    style={{ strokeDashoffset: dashOffset }} 
                  />
                </motion.svg>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
                <div className="flex-1 flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6">
                  <div className="w-20 h-20 min-w-[5rem] rounded-full bg-white border-4 border-[#0F0F0F] flex items-center justify-center font-bold text-2xl shadow-lg relative z-10">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 font-syne">Tell us what happened</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">Fill a 5-minute intake form. No legal jargon. Attach any WhatsApp screenshots or emails.</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6">
                  <div className="w-20 h-20 min-w-[5rem] rounded-full bg-[#0F0F0F] border-4 border-[#0F0F0F] text-white flex items-center justify-center font-bold text-2xl shadow-lg relative z-10">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 font-syne">We prepare your notice</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">Our legal team drafts a bulletproof notice based on your state's rent laws in 24 hours.</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6">
                  <div className="w-20 h-20 min-w-[5rem] rounded-full bg-[#E8602A] border-4 border-[#E8602A] text-white flex items-center justify-center font-bold text-2xl shadow-xl relative z-10"><Check className="w-8 h-8"/></div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 font-syne">Your landlord hears from a lawyer</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">Sent via email + registered post. Most cases resolve here once they see a law firm letterhead.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 max-w-2xl mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenFaq(openFaq === -1 ? null : -1)}
                className="w-full bg-gray-50 flex items-center justify-between p-6 hover:bg-gray-100 transition-colors"
                aria-expanded={openFaq === -1}
              >
                <div className="text-left font-bold text-gray-800">What if they don't respond?</div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === -1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === -1 && (
                <div className="p-6 bg-white border-t border-gray-100 text-gray-600 text-sm leading-relaxed animate-in slide-in-from-top-2">
                  If the landlord ignores the notice, the next step is filing a grievance at your local Rent Authority or Consumer Forum. The KiraDarbar notice serves as absolute legal proof that you attempted to resolve the dispute in good faith. Shield subscribers receive full assistance in navigating this escalation path.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BLOCK 6: PRICING */}
        <section id="pricing" className="py-24 bg-[#0F0F0F] text-white selection:bg-[#E8602A]/30">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-50px" }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-syne tracking-tight mb-4">Straightforward pricing. No hidden fees.</h2>
              <p className="text-xl text-[#888]">A lawyer's consultation alone costs ₹2,000/hour. We do the whole job.</p>
            </motion.div>

            <div className="flex justify-center mb-12">
              <div className="bg-[#1A1A1A] p-1 rounded-full inline-flex border border-white/10">
                <button onClick={() => setIsAnnual(false)} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${!isAnnual ? 'bg-white text-black' : 'text-gray-400'}`}>Monthly</button>
                <button onClick={() => setIsAnnual(true)} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white text-black' : 'text-gray-400'}`}>
                  Annual <span className="bg-[#E8602A] text-white text-[9px] uppercase px-2 py-0.5 rounded-full">Save ₹889</span>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-stretch flex-col md:flex-row">
              
              <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-[#161616] border border-white/10 rounded-2xl p-8 flex flex-col hover:border-[#E8602A]/50 transition-colors order-2 lg:order-1"
               >
                <h3 className="text-2xl font-bold font-syne mb-2">Agreement Review</h3>
                <div className="text-4xl font-bold mb-6">₹499 <span className="text-lg text-gray-500 font-medium">one-time</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Full clause-by-clause review</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Plain-language report</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Illegal clause flagging</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Negotiation tips</li>
                </ul>
                <div className="text-xs text-gray-500 font-mono mb-4 text-center">48 hour turnaround</div>
                <Link href="/signup?redirect=/dashboard/cases/new?type=agreement_review">
                  <Button className="w-full bg-white text-black hover:bg-gray-200">Review Agreement</Button>
                </Link>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ delay: 0.4, duration: 0.5 }}
                 className="bg-[#161616] border-2 border-[#D4A017] rounded-2xl p-8 flex flex-col relative transform lg:scale-105 shadow-[0_0_40px_rgba(212,160,23,0.15)] z-10 hover:border-[#D4A017] transition-colors order-1 lg:order-2"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4A017] text-black text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">Most Popular</div>
                <h3 className="text-2xl font-bold font-syne mb-2 flex justify-between items-end">
                  Shield <Shield className="w-6 h-6 text-[#D4A017] opacity-80" />
                </h3>
                 <div className="text-4xl font-bold mb-6 text-[#D4A017]">
                  {isAnnual ? '₹1,499' : '₹199'} <span className="text-lg text-gray-400 font-medium">{isAnnual ? '/year' : '/month'}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-gray-100 text-sm font-medium"><Check className="w-5 h-5 text-[#D4A017] shrink-0"/> 1 legal notice/year included</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Unlimited agreement reviews</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Priority case support</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Deposit recovery assistance</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Tenant rights helpline</li>
                </ul>
                <div className="text-xs text-[#D4A017] font-mono mb-4 text-center">Active immediately</div>
                <Link href="/signup?redirect=/dashboard/subscription">
                  <Button className="w-full bg-[#D4A017] text-black hover:bg-[#B8860B] font-bold group">Start Shield <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" /></Button>
                </Link>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-[#161616] border border-white/10 rounded-2xl p-8 flex flex-col hover:border-[#E8602A]/50 transition-colors order-3 lg:order-3"
              >
                <h3 className="text-2xl font-bold font-syne mb-2">Legal Notice</h3>
                <div className="text-4xl font-bold mb-6">₹799 <span className="text-lg text-gray-500 font-medium">one-time</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Intake form review</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Lawyer-drafted notice</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> Sent via email + registered post</li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm"><Check className="w-5 h-5 text-gray-500 shrink-0"/> PDF copy for your records</li>
                </ul>
                <div className="text-xs text-[#E8602A] font-mono mb-4 text-center">24 hour turnaround</div>
                <Link href="/signup?redirect=/dashboard/cases/new?type=legal_notice">
                  <Button className="w-full border border-[#E8602A] text-[#E8602A] bg-transparent hover:bg-[#E8602A] hover:text-white group">Send Notice <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" /></Button>
                </Link>
              </motion.div>

            </div>

            <div className="mt-16 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> All payments secured by Razorpay. Receipts sent instantly. Full refund if we can't help.
            </div>
          </div>
        </section>

        {/* BLOCK 6: TESTIMONIALS */}
        <section className="py-24 bg-[#FAF7F2] overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-syne text-[#111] tracking-tight">Tenants who fought back.</h2>
          </div>

          <div className="flex overflow-hidden relative group">
            {/* Gradient Mask */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10 pointer-events-none"></div>
            
            {/* Standard scrolling on desktop, drag-to-swipe on mobile */}
            <motion.div 
              drag="x"
              dragConstraints={{ right: 0, left: -2000 }}
              className="flex animate-marquee group-hover:[animation-play-state:paused] overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-4 hide-scrollbar cursor-grab active:cursor-grabbing"
            >
              {[
                { n: "Riya M.", c: "Bengaluru", q: "Sent the notice on Tuesday. Got my ₹65,000 deposit back by Friday. Unbelievable.", a: "₹65,000 recovered" },
                { n: "Aman K.", c: "Mumbai", q: "My landlord tried to evict me in 2 days. KiraDarbar stopped it cold. Worth every rupee." },
                { n: "Priya S.", c: "Pune", q: "Reviewed my agreement before signing. Found 3 clauses that would've trapped me for 2 years." },
                { n: "Vikram T.", c: "Hyderabad", q: "₹1.2 lakh disputed. KiraDarbar's paralegal handled everything. Got ₹90,000 back.", a: "₹90,000 recovered" },
                { n: "Sneha R.", c: "Delhi", q: "I didn't even know I had rights. The free checker changed everything." },
              ].map((t, i) => (
                <div key={i} className="flex-none w-[320px] md:w-[350px] snap-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mx-4 flex flex-col h-full transform transition-transform hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#E8602A]/20 text-[#E8602A] flex items-center justify-center font-bold text-lg">{t.n.charAt(0)}</div>
                    <div>
                      <div className="font-bold text-gray-900">{t.n}</div>
                      <div className="text-xs text-gray-500 font-mono">{t.c}</div>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-[#D4A017] fill-current" />)}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 flex-1 text-sm">"{t.q}"</p>
                  {t.a && <div className="font-bold text-green-600 text-sm mt-auto self-start bg-green-50 px-3 py-1 rounded-full">{t.a}</div>}
                </div>
              ))}
              {/* Duplicated for smooth scrolling */}
              {[
                { n: "Riya M.", c: "Bengaluru", q: "Sent the notice on Tuesday. Got my ₹65,000 deposit back by Friday. Unbelievable.", a: "₹65,000 recovered" },
                { n: "Aman K.", c: "Mumbai", q: "My landlord tried to evict me in 2 days. KiraDarbar stopped it cold. Worth every rupee." },
                { n: "Priya S.", c: "Pune", q: "Reviewed my agreement before signing. Found 3 clauses that would've trapped me for 2 years." },
                { n: "Vikram T.", c: "Hyderabad", q: "₹1.2 lakh disputed. KiraDarbar's paralegal handled everything. Got ₹90,000 back.", a: "₹90,000 recovered" },
                { n: "Sneha R.", c: "Delhi", q: "I didn't even know I had rights. The free checker changed everything." },
              ].map((t, i) => (
                <div key={i+10} className="hidden md:flex flex-none w-[350px] bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mx-4 flex-col h-full transform transition-transform hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#E8602A]/20 text-[#E8602A] flex items-center justify-center font-bold text-lg">{t.n.charAt(0)}</div>
                    <div>
                      <div className="font-bold text-gray-900">{t.n}</div>
                      <div className="text-xs text-gray-500 font-mono">{t.c}</div>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-[#D4A017] fill-current" />)}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 flex-1 text-sm">"{t.q}"</p>
                  {t.a && <div className="font-bold text-green-600 text-sm mt-auto self-start bg-green-50 px-3 py-1 rounded-full">{t.a}</div>}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* BLOCK 6: FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold font-syne text-[#111] text-center mb-16 tracking-tight">Questions tenants always ask.</h2>

            <div className="space-y-4">
              {[
                {
                  q: "Is KiraDarbar a law firm?",
                  a: "No. We are a legal services platform. We work with enrolled advocates to draft and dispatch notices on your behalf. We cannot represent you in court."
                },
                {
                  q: "Does a legal notice actually work?",
                  a: "In over 80% of cases, yes. Most landlords back down when they receive a formally drafted notice on a law firm letterhead — it signals you're serious and legally informed."
                },
                {
                  q: "What if my landlord ignores the notice?",
                  a: "We guide you to the next step: filing at the Rent Authority or Consumer Forum in your city. For Shield subscribers, we assist with this filing too."
                },
                {
                  q: "How long does it take?",
                  a: "Legal notices are drafted within 24 hours and dispatched the same day. Agreement reviews are returned within 48 hours."
                },
                {
                  q: "Which states do you cover?",
                  a: "Currently Maharashtra, Karnataka, Delhi, Telangana, Tamil Nadu, and Gujarat. Expanding to all states by Q2 2025."
                },
                {
                  q: "Is my data safe?",
                  a: "All documents are encrypted at rest and in transit. We never share your information with any third party. DPDP-compliant."
                }
              ].map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full bg-white flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-bold font-syne text-gray-900 text-left">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-6 pt-0 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-100 mt-2">
                       <div className="mt-4">{faq.a}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOCK 6: FINAL CTA */}
        <section className="py-20 md:py-32 px-6 bg-white flex justify-center">
          <div className="max-w-5xl w-full rounded-3xl p-10 md:p-20 text-center relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#E8602A] to-[#D4A017]">
            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold font-syne text-white tracking-tight leading-tight">
                Your landlord is not above the law.<br className="hidden md:block"/> Neither are you.
              </h2>
              <p className="text-lg md:text-2xl text-white/90 font-medium">
                Join 4,200+ tenants who stopped accepting injustice.
              </p>
              <div className="pt-8 flex flex-col items-center gap-4">
                <Link href="/signup">
                  <Button className="h-16 px-12 bg-white text-gray-900 text-xl font-bold hover:bg-gray-50 shadow-xl transition-transform hover:scale-105 rounded-xl group select-none">
                    Get Started Free <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <div className="text-sm font-medium text-white/70">No credit card required for the free rights check.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer Footer */}
      <footer className="bg-[#0F0F0F] px-6 py-12 text-gray-400 border-t border-white/5 text-sm text-center">
        <p>© 2026 KIRADARBAR LEGAL SOLUTIONS. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
