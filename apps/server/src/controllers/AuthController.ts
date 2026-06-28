import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        status: 'success',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ status: 'error', message: 'No refresh token provided' });
      }

      const result = await authService.refresh(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      res.clearCookie('refreshToken');
      res.status(401).json({ status: 'error', message: error.message });
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    // req.user will be populated by the authMiddleware
    res.status(200).json({
      status: 'success',
      data: {
        user: (req as any).user,
      },
    });
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const result = await authService.changePassword(userId, req.body);
      res.status(200).json({ status: 'success', message: result.message });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
