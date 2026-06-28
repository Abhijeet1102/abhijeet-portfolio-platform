"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, Search } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export default function BlogsCatalog() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Placeholder data for Cycle 1 UI
  const blogs = [
    {
      id: 1,
      title: "Architecting a RAG-powered Developer Portfolio",
      slug: "architecting-rag-portfolio",
      excerpt: "A deep dive into how I built this platform using Next.js, Pinecone, and OpenAI to create an intelligent AI assistant that knows my entire resume.",
      date: "Oct 24, 2023",
      readingTime: "8 min read",
      category: "Architecture",
    },
    {
      id: 2,
      title: "Optimizing Next.js for 100 Lighthouse Score",
      slug: "optimizing-nextjs-lighthouse",
      excerpt: "Performance optimization techniques including dynamic imports, edge caching, and font loading strategies that push Lighthouse metrics to the limit.",
      date: "Sep 15, 2023",
      readingTime: "5 min read",
      category: "Performance",
    },
    {
      id: 3,
      title: "State Management in 2024: Zustand vs Redux",
      slug: "zustand-vs-redux",
      excerpt: "Why I migrated my enterprise applications from Redux to Zustand, and the architectural benefits of atomic state management.",
      date: "Aug 02, 2023",
      readingTime: "6 min read",
      category: "Frontend",
    }
  ];

  return (
    <motion.div 
      className="max-w-5xl mx-auto py-12 flex flex-col gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Technical Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Writing about software architecture, artificial intelligence, and performance engineering.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="relative w-full md:max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search articles..." 
          className="w-full pl-10 pr-4 py-3 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
      </motion.div>

      <motion.div variants={containerVariants} className="flex flex-col gap-8">
        {blogs.map((blog) => (
          <motion.article 
            key={blog.id} 
            variants={itemVariants} 
            className="group flex flex-col gap-4 p-6 border border-border bg-card rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">{blog.category}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {blog.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {blog.readingTime}</span>
            </div>
            
            <Link href={`/blogs/${blog.slug}`}>
              <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{blog.title}</h2>
            </Link>
            
            <p className="text-muted-foreground leading-relaxed">
              {blog.excerpt}
            </p>
            
            <Button variant="link" className="w-fit p-0 mt-2 group/btn" asChild>
              <Link href={`/blogs/${blog.slug}`}>
                Read Article <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </motion.article>
        ))}
      </motion.div>
    </motion.div>
  );
}