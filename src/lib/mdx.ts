import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  
  try {
    const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return { slug: realSlug, meta: data, content };
  } catch (error) {
    return null;
  }
}

export async function getAllPosts() {
  if (!fs.existsSync(contentDirectory)) return [];
  
  const files = fs.readdirSync(contentDirectory);
  const posts = files
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        meta: data,
      };
    })
    .sort((a, b) => (new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()));

  return posts;
}
