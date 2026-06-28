import { Request, Response } from 'express';
import { chatService } from '../services/ChatService';
import { resumeService } from '../services/ResumeService';

export class AiController {
  // Public chat endpoint
  public async chat(req: Request, res: Response) {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      const response = await chatService.chat(message, history || []);
      
      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process chat message'
      });
    }
  }

  // Admin resume parsing endpoint
  public async parseResume(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Resume PDF file is required' });
      }

      const parsedData = await resumeService.parseResume(req.file.buffer);
      
      res.status(200).json({
        success: true,
        data: parsedData
      });
    } catch (error: any) {
      console.error('Resume parsing error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to parse resume'
      });
    }
  }
}

export const aiController = new AiController();
