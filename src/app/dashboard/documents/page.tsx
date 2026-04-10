import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: documents } = await supabase
    .from("documents")
    .select("*, cases(title)")
    .eq("user_id", user?.id)
    .order("uploaded_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-syne text-white italic uppercase tracking-tight">
            Document <span className="text-[#E8602A] italic">Vault</span>
          </h1>
          <p className="text-gray-400 font-medium mt-1">Access all your legal evidence and drafted notices.</p>
        </div>
      </div>

      <Card className="border border-white/5 shadow-none bg-[#1A1A1A] overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-white/5 p-6 bg-[#161616] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search documents..." 
              className="pl-10 h-10 border-white/10 bg-[#0F0F0F] text-white ring-0 focus-visible:border-[#E8602A] placeholder:text-gray-600"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none h-10 text-[10px] font-black uppercase tracking-widest gap-2 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40">
              <Filter className="w-3 h-3" />
              All Files
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {documents.map((doc: any) => (
                <Card key={doc.id} className="group hover:border-[#E8602A]/50 transition-all border border-white/5 bg-[#161616] overflow-hidden rounded-2xl">
                  <div className="p-4 border-b border-white/5 bg-[#1A1A1A] flex items-center justify-between">
                    <div className="w-8 h-8 bg-[#0F0F0F] rounded-md border border-white/10 flex items-center justify-center text-[#E8602A]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic truncate max-w-[150px]">
                      {doc.cases?.title || "General"}
                    </span>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h4 className="font-bold text-white italic truncate" title={doc.file_name}>
                        {doc.file_name}
                      </h4>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {new Date(doc.uploaded_at).toLocaleDateString()} • {(Math.random() * 5 + 1).toFixed(1)} MB
                      </p>
                    </div>
                    <Button variant="outline" className="w-full h-10 font-black italic uppercase text-[10px] tracking-widest gap-2 bg-transparent border-white/20 text-white hover:bg-[#E8602A] hover:text-white hover:border-[#E8602A] transition-all">
                      <Download className="w-3 h-3" />
                      Download File
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-white/10">
                <FileText className="w-10 h-10 text-gray-500" />
              </div>
              <div className="space-y-2">
                <p className="font-bold font-syne italic text-xl text-white">No documents found</p>
                <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto">Upload evidence while filing a case to see your documents here.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
