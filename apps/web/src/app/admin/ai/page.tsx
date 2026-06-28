"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Upload, FileText, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AiDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  const parseMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/ai/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success('Resume parsed successfully!');
      setParsedData(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to parse resume');
    }
  });

  const handleUpload = () => {
    if (file) {
      parseMutation.mutate(file);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-8 h-8" />
          AI & Resume Intelligence
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your AI assistant settings and extract information automatically from your resume.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Resume Parser
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Upload your PDF resume to automatically extract your skills, experience, and profile summary using AI.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-muted-foreground/20">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF ONLY (MAX. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md text-sm">
                  <span className="truncate">{file.name}</span>
                  <span className="text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || parseMutation.isPending}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium disabled:opacity-50"
              >
                {parseMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BrainCircuit className="w-4 h-4 mr-2" />
                )}
                Analyze Resume
              </button>
            </div>
          </div>
        </div>

        <div>
          {parsedData ? (
            <div className="rounded-xl border bg-card shadow-sm p-6 h-full space-y-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Extraction Results
              </h3>
              
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {parsedData.profile && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-primary uppercase tracking-wider">Profile</h4>
                    <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-2">
                      <p><span className="font-medium">Name:</span> {parsedData.profile.firstName} {parsedData.profile.lastName}</p>
                      <p><span className="font-medium">Headline:</span> {parsedData.profile.headline}</p>
                      <p><span className="font-medium">Bio:</span> {parsedData.profile.bio}</p>
                    </div>
                  </div>
                )}

                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-primary uppercase tracking-wider">Skills Found ({parsedData.skills.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.map((skill: any, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                          {skill.name} ({skill.category})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {parsedData.experience && parsedData.experience.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-primary uppercase tracking-wider">Experience Found ({parsedData.experience.length})</h4>
                    <div className="space-y-3">
                      {parsedData.experience.map((exp: any, i: number) => (
                        <div key={i} className="p-4 bg-muted/50 rounded-lg text-sm space-y-1">
                          <p className="font-semibold text-base">{exp.title} <span className="text-muted-foreground font-normal">at {exp.company}</span></p>
                          <p className="text-muted-foreground text-xs">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                          <p className="pt-2">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/10 shadow-sm p-6 h-full flex flex-col items-center justify-center text-center">
              <BrainCircuit className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No Data Extracted</h3>
              <p className="text-sm text-muted-foreground/60 mt-2 max-w-sm">
                Upload your resume on the left to see the AI extracted structured data here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}