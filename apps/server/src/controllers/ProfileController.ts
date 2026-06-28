import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';

const profileService = new ProfileService();

export class ProfileController {
  async get(req: Request, res: Response) {
    try {
      const profile = await profileService.getProfile();
      res.status(200).json({ status: 'success', data: profile });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const profile = await profileService.updateProfile(req.body);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
