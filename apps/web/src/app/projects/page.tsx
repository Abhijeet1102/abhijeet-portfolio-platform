"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink, Search, Filter } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/atoms/Button";

export default function ProjectsCatalog() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Placeholder data for Cycle 1 UI (will be replaced by API in Cycle 3)
  const projects = [
    {
      id: 1,
      title: "VendorWashApp",
      slug: "vendorwashapp",
      description: "A comprehensive SaaS platform connecting automotive detailers with enterprise fleets.",
      tags: ["React Native", "Node.js", "MongoDB", "Stripe"],
      image: "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
    },
    {
      id: 2,
      title: "PresiBot",
      slug: "presibot",
      description: "AI-driven presentation generator leveraging large language models to construct slidedecks.",
      tags: ["Next.js", "OpenAI API", "PostgreSQL", "Prisma"],
      image: "bg-gradient-to-br from-green-500/20 to-emerald-600/20",
    },
    {
      id: 3,
      title: "Developer OS",
      slug: "developer-os",
      description: "A highly customizable RAG-powered personal portfolio and headless CMS.",
      tags: ["React", "Express", "Tailwind", "Framer Motion"],
      image: "bg-gradient-to-br from-orange-500/20 to-red-600/20",
    },
    {
      id: 4,
      title: "Cloud Sync Engine",
      slug: "cloud-sync-engine",
      description: "Distributed file synchronization engine built for high-throughput enterprise networks.",
      tags: ["Golang", "Redis", "Docker", "AWS S3"],
      image: "bg-gradient-to-br from-cyan-500/20 to-blue-600/20",
    },
  ];

  return (
    <motion.div 
      className="max-w-7xl mx-auto py-12 flex flex-col gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Projects & Case Studies</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          An interactive archive of the software, platforms, and open-source tools I have engineered.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center justify-between border border-border bg-card p-4 rounded-xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search projects by name or technology..." 
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <motion.div key={project.id} variants={itemVariants} className="group flex flex-col border border-border bg-card rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:border-primary/40">
            <Link href={`/projects/${project.slug}`} className={`aspect-video w-full ${project.image} p-6 flex flex-col justify-between`}>
              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="rounded-full bg-background/80 backdrop-blur-md hover:bg-background">
                  <FaGithub className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full bg-background/80 backdrop-blur-md hover:bg-background">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-background/80 backdrop-blur-md text-foreground rounded text-xs font-semibold shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
            
            <div className="p-6 flex flex-col flex-1">
              <Link href={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
                <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              </Link>
              <p className="text-muted-foreground line-clamp-3 mb-6">
                {project.description}
              </p>
              
              <Button variant="ghost" className="mt-auto w-fit p-0 hover:bg-transparent hover:text-primary group/btn" asChild>
                <Link href={`/projects/${project.slug}`}>
                  Read Case Study <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}