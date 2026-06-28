const fs = require('fs');
const path = require('path');

const webSrcDir = path.join(__dirname, 'apps/web/src');

const dirs = [
  'components/atoms',
  'components/molecules',
  'components/organisms',
  'components/layouts',
  'providers',
  'lib'
];

// Create directories
dirs.forEach(dir => {
  fs.mkdirSync(path.join(webSrcDir, dir), { recursive: true });
});

// 1. Global CSS with Tailwind v4 and CSS variables
const globalsCss = `@import "tailwindcss";

@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

@theme {
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}

:root {
  --background: #ffffff;
  --foreground: #09090b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #18181b;
  --primary-foreground: #fafafa;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #18181b;
  --destructive: #ef4444;
  --destructive-foreground: #fafafa;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #18181b;
  --radius: 0.5rem;
}

.dark {
  --background: #09090b;
  --foreground: #fafafa;
  --card: #09090b;
  --card-foreground: #fafafa;
  --popover: #09090b;
  --popover-foreground: #fafafa;
  --primary: #fafafa;
  --primary-foreground: #18181b;
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --accent: #27272a;
  --accent-foreground: #fafafa;
  --destructive: #7f1d1d;
  --destructive-foreground: #fafafa;
  --border: #27272a;
  --input: #27272a;
  --ring: #d4d4d8;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground;
  }
}
`;
fs.writeFileSync(path.join(webSrcDir, 'app/globals.css'), globalsCss);

// 2. Utils
const utilsTs = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
fs.writeFileSync(path.join(webSrcDir, 'lib/utils.ts'), utilsTs);

// 3. Animations
const animTs = `export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};
`;
fs.writeFileSync(path.join(webSrcDir, 'lib/animations.ts'), animTs);

// 4. Providers
const providersTsx = `"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
`;
fs.writeFileSync(path.join(webSrcDir, 'providers/theme-provider.tsx'), providersTsx);

// 5. Layout
const layoutTsx = `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/components/organisms/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Abhijeet Rai | Portfolio Platform",
  description: "Senior Full-Stack Architect & UI/UX Planner",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={\`\${inter.variable} font-sans min-h-screen bg-background flex flex-col\`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
`;
fs.writeFileSync(path.join(webSrcDir, 'app/layout.tsx'), layoutTsx);

// 6. Components
const buttonTsx = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
export { Button, buttonVariants }
`;
fs.writeFileSync(path.join(webSrcDir, 'components/atoms/Button.tsx'), buttonTsx);

const navbarTsx = `"use client";
import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/atoms/Button";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-bold tracking-tight">AR.</Link>
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
          <Link href="/experience" className="hover:text-foreground transition-colors">Experience</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button>Resume</Button>
        </div>
      </div>
    </header>
  );
}
`;
fs.writeFileSync(path.join(webSrcDir, 'components/organisms/Navbar.tsx'), navbarTsx);

// 7. Pages Setup
const routes = [
  'about', 'skills', 'experience', 'projects', 'blogs', 'contact', 'dashboard', 'admin'
];

routes.forEach(route => {
  const routePath = path.join(webSrcDir, 'app', route);
  const capitalized = route.charAt(0).toUpperCase() + route.slice(1);
  
  const pageContent = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${capitalized} | Abhijeet Rai",
  description: "Explore my ${route}.",
};

export default function ${capitalized}Page() {
  return (
    <section className="flex flex-col gap-6 py-8 md:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">${capitalized}</h1>
        <p className="text-lg text-muted-foreground">
          Detailed information about ${route}.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Content */}
        <div className="h-64 rounded-lg border bg-card p-6 shadow-sm"></div>
        <div className="h-64 rounded-lg border bg-card p-6 shadow-sm"></div>
        <div className="h-64 rounded-lg border bg-card p-6 shadow-sm"></div>
      </div>
    </section>
  );
}
`;
  fs.writeFileSync(path.join(routePath, 'page.tsx'), pageContent);
});

// Home page
const homeTsx = `import { Button } from "@/components/atoms/Button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        Building Digital <br className="hidden sm:block" />
        <span className="text-muted-foreground">Excellence.</span>
      </h1>
      <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
        I am a Senior Full-Stack Architect crafting premium, high-performance web applications.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg"><Link href="/projects">View Projects</Link></Button>
        <Button asChild size="lg" variant="outline"><Link href="/about">About Me</Link></Button>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(path.join(webSrcDir, 'app/page.tsx'), homeTsx);

console.log('Phase 2 Scaffold complete.');
