"use client";

import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Sparkles } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex flex-col gap-24 py-12 md:py-24">
      {/* Hero Section */}
      <motion.section 
        className="flex flex-col items-center justify-center gap-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          <span>Senior Full-Stack Architect & AI Developer</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Building Digital <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">Excellence.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          I craft premium, high-performance web applications and intelligent developer ecosystems. Welcome to my digital portfolio and technical brain.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
            <Link href="/projects">
              View My Work
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
            <Link href="/about">About Me</Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Featured Projects Preview (Placeholder for real data) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col gap-8"
      >
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-muted-foreground mt-2">Some of my recent open-source and commercial work.</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/projects">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/50">
              <div className="aspect-video w-full bg-muted/40 p-6 flex flex-col justify-end border-b border-border transition-colors group-hover:bg-muted/60">
                {/* Image Placeholder */}
                <div className="flex gap-2">
                  <div className="px-2 py-1 rounded bg-background/50 backdrop-blur-md text-xs font-medium">React</div>
                  <div className="px-2 py-1 rounded bg-background/50 backdrop-blur-md text-xs font-medium">Next.js</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">Project Name {i}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">A high-performance web application built with modern architecture and seamless UX.</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Quick Stats & Technologies */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="col-span-1 border border-border rounded-2xl p-8 bg-card flex flex-col justify-center items-center text-center">
          <Code className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">15+</h3>
          <p className="text-muted-foreground">Open Source Repositories</p>
        </div>
        <div className="col-span-1 border border-border rounded-2xl p-8 bg-card flex flex-col justify-center items-center text-center">
          <Database className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">5+</h3>
          <p className="text-muted-foreground">Years of Experience</p>
        </div>
        <div className="col-span-1 border border-border rounded-2xl p-8 bg-card flex flex-col justify-center items-center text-center">
          <Sparkles className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">1M+</h3>
          <p className="text-muted-foreground">API Requests Handled</p>
        </div>
      </motion.section>
    </div>
  );
}
