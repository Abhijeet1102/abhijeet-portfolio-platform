const pdfParse = require('pdf-parse');
import Groq from 'groq-sdk';

export class ResumeService {
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

  public async parseResume(fileBuffer: Buffer) {
    if (!this.isAvailable || !this.groq) {
      throw new Error("AI services are not configured. Cannot parse resume.");
    }

    try {
      // 1. Extract text from PDF
      const pdfData = await pdfParse(fileBuffer);
      const text = pdfData.text;

      // 2. Send to AI to extract structured data
      const systemPrompt = `You are a resume parser. Extract the following information from the provided resume text and return it ONLY as a valid JSON object with the following structure:
{
  "skills": [
    { "name": "Skill Name", "category": "FRONTEND|BACKEND|DATABASE|DEVOPS|TOOLS|SOFT", "proficiency": 1-100 }
  ],
  "experience": [
    { "title": "Job Title", "company": "Company Name", "location": "Location", "startDate": "YYYY-MM", "endDate": "YYYY-MM or null", "current": boolean, "description": "Job description", "technologies": ["tech1", "tech2"] }
  ],
  "profile": {
    "firstName": "First Name",
    "lastName": "Last Name",
    "headline": "Professional Headline",
    "bio": "Short bio summary"
  }
}
Do not include any markdown formatting, code blocks, or conversational text. Return ONLY the JSON object.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `RESUME TEXT:\n${text}` }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.1,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content || "{}";
      
      try {
        const parsedData = JSON.parse(responseText);
        return parsedData;
      } catch (parseError) {
        console.error("Failed to parse AI JSON response:", responseText);
        throw new Error("AI returned invalid JSON format.");
      }

    } catch (error: any) {
      console.error('Resume parsing error:', error);
      throw new Error(error.message || "Failed to parse resume.");
    }
  }
}

export const resumeService = new ResumeService();
