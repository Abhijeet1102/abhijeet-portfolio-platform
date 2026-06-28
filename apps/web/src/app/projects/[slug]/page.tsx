"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Target, Activity } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.article 
      className="max-w-4xl mx-auto py-8 flex flex-col gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/projects" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>

      <div className="aspect-video w-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-border rounded-2xl flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for real project images */}
        <h1 className="text-4xl md:text-6xl font-bold opacity-30 absolute">{params.slug.toUpperCase()}</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 capitalize">{params.slug.replace("-", " ")}</h1>
          <div className="flex flex-wrap gap-2">
            {["React", "Node.js", "MongoDB", "Stripe"].map(tech => (
              <span key={tech} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="#" target="_blank">
              <FaGithub className="w-4 h-4 mr-2" /> Source Code
            </Link>
          </Button>
          <Button asChild>
            <Link href="#" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="border border-border rounded-xl p-4 bg-card flex flex-col gap-1 text-center">
          <span className="text-muted-foreground text-sm flex items-center justify-center gap-2"><Calendar className="w-4 h-4"/> Timeline</span>
          <span className="font-semibold">3 Months</span>
        </div>
        <div className="border border-border rounded-xl p-4 bg-card flex flex-col gap-1 text-center">
          <span className="text-muted-foreground text-sm flex items-center justify-center gap-2"><Target className="w-4 h-4"/> Role</span>
          <span className="font-semibold">Lead Developer</span>
        </div>
        <div className="border border-border rounded-xl p-4 bg-card flex flex-col gap-1 text-center">
          <span className="text-muted-foreground text-sm flex items-center justify-center gap-2"><Activity className="w-4 h-4"/> Status</span>
          <span className="font-semibold text-green-500">Completed</span>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none mt-8">
        <h2>Overview</h2>
        <p>
          This is a detailed case study placeholder for the project. In the final version, this section will dynamically render Markdown or Rich Text directly from the MongoDB database created in Phase 5.
        </p>
        
        <h2>The Challenge</h2>
        <p>
          Building scalable software involves navigating complex requirements. For this platform, the primary challenge was architecting a system that could handle high throughput while maintaining strict data consistency across microservices.
        </p>
        
        <h2>The Solution & Architecture</h2>
        <p>
          We utilized a modern stack featuring Next.js for the frontend edge-caching and Node.js (Express) for the backend REST APIs. The database layer leverages MongoDB Atlas for horizontal scalability.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li>Real-time data synchronization using WebSockets.</li>
          <li>Optimized media delivery via Cloudinary CDN.</li>
          <li>Role-based Access Control (RBAC) supporting Admin, Editor, and Viewer tiers.</li>
          <li>Integrated Stripe for seamless payment processing.</li>
        </ul>
      </div>
    </motion.article>
  );
}