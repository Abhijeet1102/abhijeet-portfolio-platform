"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Target, Activity } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Defensive unwrapping of Next.js 15 params promise
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    const fetchProject = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/projects/${slug}`);
        const data = await res.json();
        
        if (process.env.NODE_ENV === 'development') {
          console.log("Received project payload:", data);
        }
        
        if (data.status === 'success' && data.data) {
          setProject(data.data);
        } else {
          setError(data.message || "Project not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 flex justify-center text-muted-foreground">Loading...</div>;
  }

  if (error || !project) {
    return <div className="max-w-4xl mx-auto py-12 flex justify-center text-red-500">{error || "Project not found"}</div>;
  }

  // Defensive array fallback
  const displayTags = project?.technologies?.length > 0 
    ? project.technologies 
    : (project?.tags || []);

  return (
    <motion.article 
      className="max-w-4xl mx-auto py-8 flex flex-col gap-8 px-4 md:px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/projects" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>

      {project?.coverImage ? (
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border">
          <img src={project.coverImage} alt={project?.title || ""} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-border rounded-2xl flex items-center justify-center relative overflow-hidden">
          <h1 className="text-4xl md:text-6xl font-bold opacity-30 absolute">{(slug || "").toUpperCase()}</h1>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 capitalize">
            {project?.title || (slug || "").replace("-", " ")}
          </h1>
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tech: string, i: number) => (
              <span key={`${tech}-${i}`} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          {project?.githubRepository && (
            <Button asChild variant="outline">
              <Link href={project.githubRepository} target="_blank">
                <FaGithub className="w-4 h-4 mr-2" /> Source Code
              </Link>
            </Button>
          )}
          {project?.liveDemo && (
            <Button asChild>
              <Link href={project.liveDemo} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="border border-border rounded-xl p-4 bg-card flex flex-col gap-1 text-center">
          <span className="text-muted-foreground text-sm flex items-center justify-center gap-2"><Target className="w-4 h-4"/> Category</span>
          <span className="font-semibold">{project?.category || "General"}</span>
        </div>
        <div className="border border-border rounded-xl p-4 bg-card flex flex-col gap-1 text-center">
          <span className="text-muted-foreground text-sm flex items-center justify-center gap-2"><FaGithub className="w-4 h-4"/> Repo Stats</span>
          <span className="font-semibold flex items-center justify-center gap-2">
            ⭐ {project?.stargazersCount || 0} | 🍴 {project?.forksCount || 0}
          </span>
        </div>
        <div className="border border-border rounded-xl p-4 bg-card flex flex-col gap-1 text-center">
          <span className="text-muted-foreground text-sm flex items-center justify-center gap-2"><Activity className="w-4 h-4"/> Status</span>
          <span className="font-semibold text-green-500">{project?.status ? String(project.status).toUpperCase() : "UNKNOWN"}</span>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none mt-8">
        <h2>Overview</h2>
        <p>{project?.fullDescription || project?.shortDescription || "No description provided."}</p>
        
        {project?.problemStatement && (
          <>
            <h2>The Challenge</h2>
            <p>{project.problemStatement}</p>
          </>
        )}
        
        {project?.solution && (
          <>
            <h2>The Solution & Architecture</h2>
            <p>{project.solution}</p>
          </>
        )}

        {project?.features && Array.isArray(project.features) && project.features.length > 0 && (
          <>
            <h2>Key Features</h2>
            <ul>
              {project.features.map((feature: string, idx: number) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.article>
  );
}