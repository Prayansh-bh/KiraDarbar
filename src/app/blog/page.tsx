import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Tenant Law Library & Updates | KiraDarbar",
  description: "Read the latest legally vetted updates and tips regarding tenant protection, avoiding illegal evictions, and securing your renting experience.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-dm-sans selection:bg-[#E8602A]/20 pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold font-syne text-[#111] tracking-tight mb-4">
          Tenant Law <span className="text-[#E8602A] italic">Library</span>.
        </h1>
        <p className="text-xl text-gray-500 mb-16">Guides, strategies, and legal ammunition strictly for protecting Indian renters.</p>
        
        <div className="space-y-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] group-hover:-translate-y-1 transition-all">
                <div className="text-sm text-[#E8602A] font-bold tracking-widest uppercase mb-2">
                  {new Date(post.meta.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h2 className="text-2xl font-bold font-syne text-gray-900 mb-3 group-hover:text-[#E8602A] transition-colors">
                  {post.meta.title}
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-2xl">
                  {post.meta.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
