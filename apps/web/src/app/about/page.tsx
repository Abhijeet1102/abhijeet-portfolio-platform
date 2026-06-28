"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { Download, MapPin, Mail, Calendar } from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto py-12 flex flex-col gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About Me</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          I am Abhijeet Rai, a Senior Full-Stack Architect specialized in building highly scalable, AI-powered developer ecosystems.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 border border-border bg-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="aspect-square bg-muted rounded-xl w-full flex items-center justify-center text-muted-foreground">
            [Profile Photo]
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" /> Based in India
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" /> contact@abhijeetrai.dev
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" /> Available for Opportunities
            </div>
          </div>
          <Button className="w-full mt-4" asChild>
            <Link href="/resume.pdf" target="_blank">
              <Download className="w-4 h-4 mr-2" /> Download Resume
            </Link>
          </Button>
        </div>

        <div className="col-span-2 flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-2">Biography</h2>
          <div className="prose dark:prose-invert text-muted-foreground max-w-none">
            <p>
              With over 5 years of experience in full-stack development, I&apos;ve designed and built systems handling millions of requests.
              My core philosophy is that code should not only function perfectly, but the developer experience (DX) and user interface (UI) must feel premium.
            </p>
            <p>
              I specialize in React, Node.js, Next.js, and integrating complex AI ecosystems using LLMs and Vector databases (RAG architecture).
              This very portfolio is a testament to my capabilities—running as a fully dynamic, headless CMS powered by AI.
            </p>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-2 mt-6">Core Competencies</h2>
          <div className="flex flex-wrap gap-2">
            {["System Architecture", "AI Integration (RAG)", "Full-Stack Development", "UI/UX Planning", "DevOps & CI/CD", "Performance Optimization"].map((skill) => (
              <span key={skill} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
