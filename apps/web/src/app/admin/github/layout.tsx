"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Settings, List, Activity } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export default function GithubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Overview', href: '/admin/github', icon: Activity },
    { name: 'Repositories', href: '/admin/github/repositories', icon: List },
    { name: 'Settings', href: '/admin/github/settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FaGithub className="w-8 h-8" />
          GitHub Synchronization
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your connected GitHub account, repositories, and automated imports.
        </p>
      </div>

      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4">
        {children}
      </div>
    </div>
  );
}
