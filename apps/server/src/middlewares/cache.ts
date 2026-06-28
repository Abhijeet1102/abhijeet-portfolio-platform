import { Request, Response, NextFunction } from 'express';

// Simple in-memory cache fallback (used if Redis is not configured or as a graceful degradation)
const cacheStore = new Map<string, { value: any; expiry: number }>();

export const cache = (durationInSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    const cachedItem = cacheStore.get(key);

    if (cachedItem && cachedItem.expiry > Date.now()) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedItem.value);
    }

    res.setHeader('X-Cache', 'MISS');

    // Override res.json to intercept the response and cache it
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, {
          value: body,
          expiry: Date.now() + durationInSeconds * 1000
        });
      }
      return originalJson(body);
    };

    next();
  };
};

// Utility to clear cache for a specific route or pattern
export const clearCachePattern = (pattern: string) => {
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) {
      cacheStore.delete(key);
    }
  }
};
