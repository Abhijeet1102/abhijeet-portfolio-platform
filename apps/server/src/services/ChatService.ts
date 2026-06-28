import Groq from 'groq-sdk';
import { Project } from '../models/Project';
import { Blog } from '../models/Blog';
import { Profile } from '../models/Profile';
import { Experience } from '../models/Experience';
import { Skill } from '../models/Skill';

// We'll support both OpenAI and Groq if available
// For this implementation, Groq is prioritized if available for fast inference
export class ChatService {
  private groq: Groq | null = null;
  private isAvailable: boolean = false;

  constructor() {
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      this.groq = new Groq({ apiKey: groqKey });
      this.isAvailable = true;
    }
  }

  public getAvailableStatus() {
    return this.isAvailable;
  }

  // Simplified context building (RAG-lite)
  private async buildContext(query: string): Promise<string> {
    // In a full RAG system, we would embed the query and perform a vector search
    // Here we'll build a concise text context of the portfolio since it fits in context window
    
    const [profile, projects, experience, skills] = await Promise.all([
      Profile.findOne(),
      Project.find({ status: 'PUBLISHED' }).select('title shortDescription technologies').limit(5),
      Experience.find().limit(3),
      Skill.find().limit(20)
    ]);

    let context = `PORTFOLIO CONTEXT:\n`;
    
    if (profile) {
      context += `Name: ${profile.name}\n`;
      context += `Headline: ${profile.headline}\n`;
      context += `Bio: ${profile.bio}\n\n`;
    }

    if (skills.length > 0) {
      context += `Skills: ${skills.map(s => s.title).join(', ')}\n\n`;
    }

    if (projects.length > 0) {
      context += `Top Projects:\n`;
      projects.forEach(p => {
        context += `- ${p.title}: ${p.shortDescription} (Tech: ${p.technologies.join(', ')})\n`;
      });
      context += '\n';
    }

    if (experience.length > 0) {
      context += `Recent Experience:\n`;
      experience.forEach(e => {
        context += `- ${e.title}\n`;
      });
      context += '\n';
    }

    return context;
  }

  public async chat(message: string, history: any[] = []) {
    if (!this.isAvailable || !this.groq) {
      return {
        reply: "I'm currently running in offline mode. The AI assistant hasn't been configured with API keys yet. Please contact the administrator to enable AI features.",
        offline: true
      };
    }

    const context = await this.buildContext(message);

    const systemPrompt = `You are an AI assistant for a developer's portfolio website. 
Your goal is to answer questions about the developer based ONLY on the provided context.
If you don't know the answer based on the context, politely say so. Do not invent information.
Keep your answers concise, professional, and friendly.

${context}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ];

    try {
      const completion = await this.groq.chat.completions.create({
        messages: messages as any,
        model: 'llama3-8b-8192',
        temperature: 0.5,
        max_tokens: 512,
      });

      return {
        reply: completion.choices[0]?.message?.content || "I couldn't generate a response.",
        offline: false
      };
    } catch (error: any) {
      console.error('Groq chat error:', error);
      return {
        reply: "I encountered an error connecting to my brain. Please try again later.",
        offline: true
      };
    }
  }
}

export const chatService = new ChatService();
