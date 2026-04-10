"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, MapPin, Save, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    permanentAddress: "",
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData({
          fullName: profile.full_name || "",
          phone: profile.phone || "",
          city: profile.city || "",
          state: profile.state || "",
          permanentAddress: profile.landlord_address || "", // Re-using this for user address or update schema later
        });
      }
      setLoading(false);
    }

    getProfile();
  }, [supabase, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("users")
      .update({
        full_name: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
      })
      .eq("id", user?.id);

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black font-syne text-white italic uppercase tracking-tight">
          Account <span className="text-[#E8602A] italic">Settings</span>
        </h1>
        <p className="text-gray-400 font-medium mt-1">Manage your identity and contact information for legal filings.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border border-white/5 shadow-none bg-[#1A1A1A] overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-white/5 p-6 bg-[#161616]">
            <CardTitle className="text-xl font-bold font-syne italic text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name (As per Aadhar)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-white/10 bg-[#0F0F0F] text-white focus-visible:border-[#E8602A] placeholder:text-gray-600"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-gray-400">Phone Number (WhatsApp Preferred)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-white/10 bg-[#0F0F0F] text-white focus-visible:border-[#E8602A] placeholder:text-gray-600"
                    placeholder="+91"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-black uppercase tracking-widest text-gray-400">Current City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-white/10 bg-[#0F0F0F] text-white focus-visible:border-[#E8602A] placeholder:text-gray-600"
                    placeholder="e.g. Bengaluru"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-xs font-black uppercase tracking-widest text-gray-400">State</Label>
                <Input 
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="h-12 border-white/10 bg-[#0F0F0F] text-white focus-visible:border-[#E8602A] placeholder:text-gray-600"
                  placeholder="e.g. Karnataka"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="permanentAddress" className="text-xs font-black uppercase tracking-widest text-gray-400">Permanent Address</Label>
              <Textarea 
                id="permanentAddress"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                className="min-h-[120px] border-white/10 bg-[#0F0F0F] text-white focus-visible:border-[#E8602A] placeholder:text-gray-600"
                placeholder="Complete address for legal correspondence..."
              />
            </div>
          </CardContent>
          <div className="p-6 bg-[#161616] border-t border-white/5 flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400 italic">
              * This information will be used to auto-populate your legal notices.
            </p>
            <Button 
              type="submit" 
              disabled={saving}
              className={`h-12 px-8 font-black italic uppercase tracking-tighter gap-2 transition-all text-white ${
                success ? "bg-green-600 hover:bg-green-700" : "bg-[#E8602A] hover:bg-[#ff7a45]"
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved Changes
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
