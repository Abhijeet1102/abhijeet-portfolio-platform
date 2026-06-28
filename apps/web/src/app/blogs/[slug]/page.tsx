"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.article 
      className="max-w-3xl mx-auto py-8 flex flex-col gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/blogs" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>

      <header className="flex flex-col gap-6 border-b border-border pb-8">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium text-sm">Architecture</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight capitalize leading-tight">
          {params.slug.replace(/-/g, " ")}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm mt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="font-medium text-foreground">Abhijeet Rai</span>
          </div>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Oct 24, 2023</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 8 min read</span>
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="lead text-xl text-muted-foreground mb-8">
          This is a placeholder for the blog content. The final implementation will parse standard Markdown from the MongoDB CMS and render it safely using a remark/rehype pipeline.
        </p>
        
        <h2>Introduction</h2>
        <p>
          Building a modern web application requires carefully weighing trade-offs between performance, scalability, and developer experience.
        </p>
        
        <h3>The Architecture</h3>
        <p>
          We chose Next.js for its superior edge-caching capabilities and server components. By utilizing React Server Components, we drastically reduced the client-side JavaScript bundle, resulting in near-instant load times.
        </p>
        
        <pre><code>{`// Example Code Block
export async function getStaticProps() {
  const data = await fetchCMS();
  return { props: { data } };
}`}</code></pre>

        <h2>Conclusion</h2>
        <p>
          The resulting application achieved a 100 Lighthouse score while maintaining a complex UI driven by Framer Motion. 
        </p>
      </div>
    </motion.article>
  );
}