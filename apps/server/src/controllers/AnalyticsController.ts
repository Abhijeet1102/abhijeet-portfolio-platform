import { Request, Response } from 'express';
import crypto from 'crypto';
import { Visit } from '../models/Visit';

export class AnalyticsController {
  
  // Public endpoint to record a visit
  public async recordVisit(req: Request, res: Response) {
    try {
      const { path, referrer, duration } = req.body;
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown') as string;
      
      // Hash IP for privacy compliance
      const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

      // Basic user agent parsing
      let deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'UNKNOWN' = 'UNKNOWN';
      const uaLower = userAgent.toLowerCase();
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(uaLower)) {
        deviceType = 'TABLET';
      } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        deviceType = 'MOBILE';
      } else {
        deviceType = 'DESKTOP';
      }

      let browser = 'Unknown';
      if (uaLower.includes('firefox')) browser = 'Firefox';
      else if (uaLower.includes('chrome')) browser = 'Chrome';
      else if (uaLower.includes('safari')) browser = 'Safari';
      else if (uaLower.includes('edge')) browser = 'Edge';

      let os = 'Unknown';
      if (uaLower.includes('win')) os = 'Windows';
      else if (uaLower.includes('mac')) os = 'MacOS';
      else if (uaLower.includes('linux')) os = 'Linux';
      else if (uaLower.includes('android')) os = 'Android';
      else if (uaLower.includes('ios')) os = 'iOS';

      const visit = await Visit.create({
        path: path || '/',
        referrer: referrer || '',
        userAgent,
        ipHash,
        deviceType,
        browser,
        os,
        duration: duration || 0
      });

      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Error recording visit:', error);
      // Don't fail the frontend if tracking fails
      res.status(200).json({ success: false }); 
    }
  }

  // Admin endpoint to get analytics summary
  public async getSummary(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const visits = await Visit.find({ timestamp: { $gte: startDate } });
      
      const totalVisits = visits.length;
      
      // Calculate unique visitors (by IP Hash)
      const uniqueVisitors = new Set(visits.map(v => v.ipHash)).size;

      // Group by Path
      const topPages = await Visit.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Group by Device
      const devices = await Visit.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: "$deviceType", count: { $sum: 1 } } }
      ]);

      // Group by Date for Chart
      const dailyVisits = await Visit.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { 
          $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalVisits,
          uniqueVisitors,
          topPages,
          devices,
          dailyVisits
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const analyticsController = new AnalyticsController();
