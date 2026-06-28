"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export default function ExperiencePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const experiences = [
    {
      id: 1,
      role: "Senior Full-Stack Architect",
      company: "Tech Innovators Inc.",
      period: "2022 - Present",
      description: "Leading the architectural design and development of enterprise scalable AI platforms. Engineered the migration from legacy monolithic systems to a modernized microservices approach using Next.js and NestJS, reducing deployment times by 40% and infrastructure costs by 25%.",
      technologies: ["React", "Node.js", "AWS", "MongoDB", "TypeScript"],
    },
    {
      id: 2,
      role: "Full-Stack Developer",
      company: "Digital Solutions Agency",
      period: "2020 - 2022",
      description: "Developed and maintained multiple client-facing applications. Spearheaded the implementation of comprehensive CI/CD pipelines and automated testing, improving code reliability and reducing production bugs by over 60%.",
      technologies: ["React", "Express", "PostgreSQL", "Docker", "GitHub Actions"],
    },
    {
      id: 3,
      role: "Frontend Developer",
      company: "Creative Web Studio",
      period: "2018 - 2020",
      description: "Built responsive, high-performance user interfaces for e-commerce clients. Integrated complex state management using Redux and significantly improved Lighthouse performance scores across all major client sites.",
      technologies: ["JavaScript", "React", "Redux", "SCSS", "Webpack"],
    }
  ];

  return (
    <motion.div 
      className="max-w-4xl mx-auto py-12 flex flex-col gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Professional Experience</h1>
        <p className="text-xl text-muted-foreground">
          My journey through tech, building scalable products and leading development teams.
        </p>
      </motion.div>

      <div className="relative border-l border-border ml-3 md:ml-6 flex flex-col gap-12 pb-8">
        {experiences.map((exp) => (
          <motion.div key={exp.id} variants={itemVariants} className="relative pl-8 md:pl-12">
            <div className="absolute -left-[21px] top-1 bg-primary text-primary-foreground p-2 rounded-full border-4 border-background">
              <Briefcase className="w-5 h-5" />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h2 className="text-2xl font-bold">{exp.role}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full w-fit">
                  <Calendar className="w-4 h-4" />
                  {exp.period}
                </div>
              </div>
              <h3 className="text-lg text-primary font-medium">{exp.company}</h3>
              
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {exp.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {exp.technologies.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium border border-border/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
