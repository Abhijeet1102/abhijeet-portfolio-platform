"use client";

import { motion } from "framer-motion";
import { Code, Server, Database, Cloud, Wrench, Layers } from "lucide-react";

export default function SkillsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Layers className="w-6 h-6 text-primary" />,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand", "Redux"],
    },
    {
      title: "Backend Development",
      icon: <Server className="w-6 h-6 text-primary" />,
      skills: ["Node.js", "Express", "NestJS", "Python", "GraphQL", "REST APIs"],
    },
    {
      title: "Database & AI",
      icon: <Database className="w-6 h-6 text-primary" />,
      skills: ["MongoDB", "PostgreSQL", "Redis", "Pinecone", "LangChain", "OpenAI API"],
    },
    {
      title: "Cloud & DevOps",
      icon: <Cloud className="w-6 h-6 text-primary" />,
      skills: ["AWS", "Docker", "GitHub Actions", "Vercel", "Railway", "CI/CD"],
    },
    {
      title: "Architecture & Testing",
      icon: <Code className="w-6 h-6 text-primary" />,
      skills: ["Microservices", "System Design", "Jest", "Cypress", "Sentry", "TDD"],
    },
    {
      title: "Tools & Extras",
      icon: <Wrench className="w-6 h-6 text-primary" />,
      skills: ["Git", "Figma", "Turborepo", "WebSockets", "OAuth", "Stripe"],
    },
  ];

  return (
    <motion.div 
      className="max-w-5xl mx-auto py-12 flex flex-col gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Technical Skills</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A comprehensive overview of the technologies, frameworks, and tools I use to build scalable production-ready applications.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category) => (
          <div key={category.title} className="border border-border bg-card rounded-2xl p-6 transition-all hover:border-primary/50 hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                {category.icon}
              </div>
              <h2 className="text-xl font-bold">{category.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
