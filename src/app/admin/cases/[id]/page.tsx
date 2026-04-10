"use client";

import { useEffect, useState } from "react";
import { 
  ArrowLeft, CheckCircle2, User, Phone, MapPin, Download, Save, Send, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// TipTap Editor
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

import { use } from "react";

export default function AdminCaseWorkbench({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notice, setNotice] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  // Initialize TipTap
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start drafting the legal notice...' })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px]',
      },
    },
  });

  useEffect(() => {
    async function loadWorkbench() {
      // Setup data
      const [
        { data: cData },
        { data: dData },
        { data: nData }
      ] = await Promise.all([
        supabase.from('cases').select('*, users!cases_user_id_fkey(full_name, phone)').eq('id', id).single(),
        supabase.from('documents').select('*').eq('case_id', id),
        supabase.from('notices').select('*').eq('case_id', id).maybeSingle()
      ]);

      if (!cData) return router.push("/admin/cases");

      setCaseData(cData);
      setDocuments(dData || []);
      setNotice(nData);
      setNotes(cData.notes || "");

      // Auto-fill template if editor is empty and no notice exists
      if (editor && !nData && editor.isEmpty) {
        const template = `
        <h2 style="text-align: center">LEGAL NOTICE</h2>
        <p><strong>To:</strong><br/>${cData.landlord_name || '[Landlord Name]'} <br/> ${cData.landlord_address || '[Landlord Address]'}</p>
        <p><strong>Under the Instructions of my Client:</strong><br/>${cData.users?.full_name || '[Tenant Name]'} <br/> ${cData.property_address || '[Property Address]'}</p>
        <hr/>
        <p>Dear Sir/Madam,</p>
        <p>Under instructions from my client named above, I hereby issue this legal notice under the applicable provisions of the Rent Control Act / Transfer of Property Act:</p>
        <p><strong>Facts of the Dispute:</strong><br/>${cData.description}</p>
        <p><strong>Demands:</strong><br/>Client demands the restitution of rights and/or return of ₹${cData.amount_disputed || '[Amount]'} immediately.</p>
        <p>Failure to comply within 15 days will result in civil/criminal proceedings at your risk and cost.</p>
        <p>Yours Faithfully,<br/><strong>KiraDarbar Legal Team</strong></p>
        `;
        editor.commands.setContent(template);
      } else if (editor && nData) {
        editor.commands.setContent(nData.content_md);
      }

      setLoading(false);
    }
    if (editor) loadWorkbench();
  }, [id, editor, router, supabase]);

  const saveWorkspace = async () => {
    setIsSaving(true);
    await supabase.from('cases').update({ notes }).eq('id', id);
    
    const htmlContent = editor?.getHTML() || "";
    
    if (notice) {
      await supabase.from('notices').update({ content_md: htmlContent }).eq('id', notice.id);
    } else {
      const { data } = await supabase.from('notices').insert({
        case_id: id,
        content_md: htmlContent,
        status: 'draft'
      }).select().single();
      if (data) setNotice(data);
    }

    setIsSaving(false);
    alert("Workspace saved.");
  };

  const approveAndSend = async () => {
    if (!confirm("This will lock the notice and dispatch it via email/post. Proceed?")) return;
    setIsSaving(true);
    
    await saveWorkspace();
    
    // Mark Notice Approved/Sent
    await supabase.from('notices').update({ 
      status: 'sent', 
      delivery_method: 'email',
      sent_at: new Date().toISOString() 
    }).eq('case_id', id);
    
    // Move Case to In Progress
    await supabase.from('cases').update({ status: 'in_progress' }).eq('id', id);
    
    setIsSaving(false);
    window.location.reload();
  };

  if (loading) return <div className="p-12 animate-pulse font-mono text-sm text-gray-500">Loading Workbench...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/cases" className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-syne text-[#0F0F0F]">{caseData?.title}</h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">
              Case ID: {caseData?.id.split('-')[0]} • Status: <span className="text-indigo-600 font-bold">{caseData?.status}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" onClick={saveWorkspace} disabled={isSaving} className="bg-white font-bold h-10 border-gray-200 shadow-sm">
             <Save className="w-4 h-4 mr-2" /> Save Draft
           </Button>
           <Button onClick={approveAndSend} disabled={isSaving || notice?.status === 'sent'} className="bg-[#E8602A] hover:bg-[#D4501D] text-white font-bold h-10 shadow-sm">
             <Send className="w-4 h-4 mr-2" /> {notice?.status === 'sent' ? 'Already Sent' : 'Approve & Dispatch'}
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Case Data & Internal Notes */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
             <div>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Tenant Intel</h3>
               <div className="space-y-3">
                 <div className="flex items-start gap-2"><User className="w-4 h-4 text-gray-400 mt-0.5" /><span className="text-sm font-bold text-gray-800">{caseData.users?.full_name}</span></div>
                 <div className="flex items-start gap-2"><Phone className="w-4 h-4 text-gray-400 mt-0.5" /><span className="text-sm font-mono text-gray-600">{caseData.users?.phone}</span></div>
               </div>
             </div>
             
             <div>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Dispute Context</h3>
               <div className="space-y-3 text-sm text-gray-700">
                 <p><strong className="font-bold text-[#0F0F0F]">Landlord:</strong> {caseData.landlord_name}</p>
                 <p><strong className="font-bold text-[#0F0F0F]">Property:</strong> {caseData.property_address}</p>
                 <p><strong className="font-bold text-[#0F0F0F]">Dispute (₹):</strong> {caseData.amount_disputed || 'N/A'}</p>
               </div>
               <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-lg text-xs leading-relaxed font-medium text-gray-600 max-h-[200px] overflow-y-auto">
                 {caseData.description}
               </div>
             </div>
             
             <div>
               <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Internal Paralegal Notes</h3>
               <Textarea 
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 className="min-h-[120px] text-sm bg-amber-50/50 border-amber-200 focus-visible:ring-amber-400"
                 placeholder="Private notes (not visible to tenant)..."
               />
             </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Tenant Evidence</h3>
            {documents.length > 0 ? documents.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 border border-gray-100 rounded hover:border-[#E8602A] transition-colors bg-gray-50">
                 <span className="text-xs font-bold text-gray-700 truncate mr-2">{d.file_name}</span>
                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-[#E8602A]">
                   <Download className="w-4 h-4" />
                 </Button>
              </div>
            )) : <p className="text-xs text-gray-500 italic">No files attached.</p>}
          </div>
        </div>

        {/* Right Col: Drafting Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
             
             {/* Toolbar */}
             <div className="h-14 border-b border-gray-100 bg-gray-50 flex items-center justify-between px-4">
               <div className="flex items-center gap-2">
                 <div className="px-2 py-1 bg-white border border-gray-200 text-xs font-bold font-mono text-gray-500 rounded"><Eye className="w-3 h-3 inline mr-1"/> Draft Mode</div>
                 {notice?.status === 'sent' && <div className="px-2 py-1 bg-green-100 border border-green-200 text-xs font-bold text-green-700 uppercase rounded">Locked & Sent</div>}
               </div>
               
               <div className="flex gap-1">
                 <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()} className={`h-8 w-8 p-0 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}><strong>B</strong></Button>
                 <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`h-8 w-8 p-0 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}><em>I</em></Button>
                 <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`h-8 w-8 p-0 ${editor?.isActive('heading') ? 'bg-gray-200' : ''}`}>H</Button>
                 <div className="w-px h-5 bg-gray-200 mx-2 self-center"></div>
                 <Button variant="ghost" size="sm" onClick={() => editor?.commands.setContent('')} className="h-8 text-xs text-red-500 hover:bg-red-50">Clear</Button>
               </div>
             </div>

             {/* Editor Canvas */}
             <div className="flex-1 p-8 bg-[#FAFAFA] overflow-y-auto">
               <div className="max-w-3xl mx-auto bg-white min-h-[800px] border border-gray-200 shadow-md p-10 md:p-16">
                  {editor ? (
                    <div className="${notice?.status === 'sent' ? 'pointer-events-none opacity-80' : ''}">
                      <EditorContent editor={editor} />
                    </div>
                  ) : (
                    <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-2 bg-gray-200 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-gray-200 rounded col-span-2"></div><div className="h-2 bg-gray-200 rounded col-span-1"></div></div><div className="h-2 bg-gray-200 rounded"></div></div></div></div>
                  )}
               </div>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
