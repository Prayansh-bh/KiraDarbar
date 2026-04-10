import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found | KiraDarbar' };
  }
  
  return {
    title: `${post.meta.title} | KiraDarbar — Tenant Legal Protection`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  // Basic markdown component overrides to match our design system
  const components = {
    h1: (props: any) => <h1 className="text-3xl md:text-5xl font-bold font-syne text-[#111] mt-12 mb-6" {...props} />,
    h2: (props: any) => <h2 className="text-2xl md:text-3xl font-bold font-syne text-[#0F0F0F] mt-12 mb-4" {...props} />,
    h3: (props: any) => <h3 className="text-xl md:text-2xl font-bold font-syne text-[#0F0F0F] mt-8 mb-4 border-l-4 border-[#E8602A] pl-3" {...props} />,
    p: (props: any) => <p className="text-lg text-gray-700 leading-relaxed mb-6" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 space-y-3 text-lg text-gray-700 mb-6" {...props} />,
    li: (props: any) => <li {...props} />,
    strong: (props: any) => <strong className="font-bold text-black" {...props} />,
  };

  return (
    <div className="min-h-screen bg-white font-dm-sans selection:bg-[#E8602A]/20 pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#E8602A] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
        </Link>
        
        <div className="mb-12 border-b border-gray-100 pb-12">
          <div className="text-sm text-[#E8602A] font-bold tracking-widest uppercase mb-4">
            {new Date(post.meta.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-syne text-gray-900 tracking-tight leading-[1.1] mb-6">
            {post.meta.title}
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            {post.meta.description}
          </p>
        </div>

        <article className="prose prose-lg prose-gray max-w-none">
          <MDXRemote source={post.content} components={components} />
        </article>
      </div>
    </div>
  );
}
