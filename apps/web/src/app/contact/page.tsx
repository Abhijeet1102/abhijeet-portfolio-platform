"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate API Call
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto py-12 flex flex-col gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Interested in working together or have a question? Drop me a message and I&apos;ll get back to you as soon as possible.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">Contact Information</h3>
            <p className="text-muted-foreground">My inbox is always open. Whether you have a question or just want to say hi.</p>
          </div>
          
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-muted-foreground">contact@abhijeetrai.dev</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Location</h4>
                <p className="text-muted-foreground">India (Remote Available)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 border border-border rounded-2xl bg-card p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Message Sent!</h3>
              <p className="text-muted-foreground">Thank you for reaching out. I&apos;ll respond shortly.</p>
              <Button onClick={() => setStatus("idle")} variant="outline" className="mt-4">Send another message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <input 
                    required
                    type="text" 
                    id="name" 
                    className="p-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input 
                    required
                    type="email" 
                    id="email" 
                    className="p-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input 
                  required
                  type="text" 
                  id="subject" 
                  className="p-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Project Inquiry"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea 
                  required
                  id="message" 
                  rows={6}
                  className="p-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  placeholder="Tell me about your project..."
                />
              </div>
              
              <Button type="submit" size="lg" className="w-full md:w-auto self-start" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
