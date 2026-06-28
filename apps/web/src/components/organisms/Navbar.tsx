"use client";
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
