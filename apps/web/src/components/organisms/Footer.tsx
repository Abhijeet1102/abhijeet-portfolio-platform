import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Abhijeet Rai. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="https://github.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            <FaGithub className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            <FaLinkedin className="w-5 h-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            <FaTwitter className="w-5 h-5" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
