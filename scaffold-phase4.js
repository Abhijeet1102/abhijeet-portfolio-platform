const fs = require('fs');
const path = require('path');

const serverSrc = path.join(__dirname, 'apps/server/src');
const webSrc = path.join(__dirname, 'apps/web/src');
const serverDocs = path.join(__dirname, 'apps/server/docs');

// Create required directories
const dirs = [
  path.join(serverSrc, 'auth'),
  path.join(serverSrc, 'middlewares'),
  path.join(serverSrc, 'services'),
  path.join(serverSrc, 'models'),
  path.join(webSrc, 'lib/store'),
  path.join(webSrc, 'providers'),
  path.join(webSrc, 'app/(auth)/login'),
  path.join(webSrc, 'app/(auth)/register'),
  path.join(webSrc, 'app/(auth)/forgot-password'),
  path.join(webSrc, 'app/(auth)/reset-password'),
  path.join(webSrc, 'app/admin'),
  path.join(webSrc, 'components/organisms/Admin'),
];

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// ==============================
// 1. BACKEND AUTH & RBAC (SERVER)
// ==============================

// Session Model (Refresh Tokens)
const sessionModel = `import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  refreshToken: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
  isValid: boolean;
}

const SessionSchema = new Schema<ISession>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  userAgent: { type: String },
  ipAddress: { type: String },
  expiresAt: { type: Date, required: true },
  isValid: { type: Boolean, default: true },
}, { timestamps: true });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
`;
fs.writeFileSync(path.join(serverSrc, 'models/Session.ts'), sessionModel);

// Auth Middlewares (auth.ts & rbac.ts)
const authMiddleware = `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or Expired Token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient Permissions' });
    }
    next();
  };
};
`;
fs.writeFileSync(path.join(serverSrc, 'middlewares/auth.ts'), authMiddleware);

const rateLimiter = `import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
`;
fs.writeFileSync(path.join(serverSrc, 'middlewares/rateLimiter.ts'), rateLimiter);

// Auth Service Placeholder
const authService = `export class AuthService {
  static async login(data: any) { return { accessToken: 'token', refreshToken: 'token' }; }
  static async register(data: any) { return { success: true }; }
  static async refreshToken(token: string) { return { accessToken: 'new-token' }; }
}
`;
fs.writeFileSync(path.join(serverSrc, 'auth/auth.service.ts'), authService);

// Cloudinary Media Service Placeholder
const mediaService = `export class MediaService {
  static async uploadImage(file: any, folder: string) { return { url: 'https://cloudinary.com/image.jpg' }; }
  static async deleteImage(publicId: string) { return { success: true }; }
}
`;
fs.writeFileSync(path.join(serverSrc, 'services/media.service.ts'), mediaService);

// Auth Contract & RBAC Docs
const authContract = `# Phase 4: Auth & CMS Architecture

## Authentication Flow
1. User logs in -> Server validates password (bcrypt).
2. Server generates JWT AccessToken (15m) and RefreshToken (7d).
3. AccessToken returned in payload, RefreshToken set in secure, HttpOnly cookie.
4. On AccessToken expiry, client calls \`/auth/refresh\` to rotate tokens.

## Role-Based Access Control (RBAC) Matrix
| Module | SUPER_ADMIN | ADMIN | EDITOR | VIEWER |
|---|---|---|---|---|
| Users | CRUD | Read | None | None |
| Projects | CRUD | CRUD | Create, Read, Update | Read |
| Blogs | CRUD | CRUD | Create, Read, Update | Read |
| Settings | CRUD | Read | None | None |

## API Contracts
- \`POST /api/v1/auth/register\` -> Create user
- \`POST /api/v1/auth/login\` -> Validate & return tokens
- \`POST /api/v1/auth/refresh\` -> Rotate tokens
- \`POST /api/v1/auth/logout\` -> Invalidate session
- \`GET /api/v1/auth/me\` -> Get current user
- \`PATCH /api/v1/auth/profile\` -> Update user details
`;
fs.writeFileSync(path.join(serverDocs, 'auth-architecture.md'), authContract);


// ==============================
// 2. FRONTEND AUTH & ADMIN (WEB)
// ==============================

// Zustand Auth Store
const authStore = `import { create } from 'zustand';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  login: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
`;
fs.writeFileSync(path.join(webSrc, 'lib/store/auth.ts'), authStore);

// Auth Provider
const authProvider = `"use client";
import React, { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login } = useAuthStore();
  
  useEffect(() => {
    // Validate session or fetch /api/v1/auth/me
    // Placeholder implementation
  }, []);

  return <>{children}</>;
}
`;
fs.writeFileSync(path.join(webSrc, 'providers/auth-provider.tsx'), authProvider);

// Auth Pages (Placeholders)
const authRoutes = ['login', 'register', 'forgot-password', 'reset-password'];
authRoutes.forEach(route => {
  const content = `export default function ${route.replace('-', '')}Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 border border-border rounded-lg bg-card shadow-sm">
        <h1 className="text-2xl font-bold mb-4">${route.toUpperCase()}</h1>
        <p className="text-muted-foreground">Auth form foundation</p>
      </div>
    </div>
  );
}`;
  fs.writeFileSync(path.join(webSrc, 'app/(auth)/' + route + '/page.tsx'), content);
});

// Admin Layout Foundation
const adminLayout = `import { Navbar } from "@/components/organisms/Navbar";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // NOTE: Server-side route guard placeholder
  // if (!user.isAdmin) redirect('/login');

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block">
        <h2 className="font-bold text-xl mb-6">CMS Panel</h2>
        <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">Dashboard</Link>
          <Link href="/admin/projects" className="hover:text-foreground">Projects</Link>
          <Link href="/admin/blogs" className="hover:text-foreground">Blogs</Link>
          <Link href="/admin/settings" className="hover:text-foreground">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border bg-card flex items-center px-6">
          Admin Topbar
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(webSrc, 'app/admin/layout.tsx'), adminLayout);

console.log('Phase 4 Scaffold complete.');
