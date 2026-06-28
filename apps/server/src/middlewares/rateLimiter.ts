import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
