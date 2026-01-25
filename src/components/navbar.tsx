"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <motion.header
      className="glass-nav sticky top-0 z-50 w-full"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Neon Cabinet home"
        >
          <motion.span
            className="neon-text-green font-pixel text-sm sm:text-base"
            whileHover={{
              textShadow: [
                "0 0 7px rgba(57, 255, 20, 0.7), 0 0 20px rgba(57, 255, 20, 0.5), 0 0 35px rgba(57, 255, 20, 0.3)",
                "0 0 10px rgba(57, 255, 20, 0.9), 0 0 30px rgba(57, 255, 20, 0.7), 0 0 50px rgba(57, 255, 20, 0.5)",
                "0 0 7px rgba(57, 255, 20, 0.7), 0 0 20px rgba(57, 255, 20, 0.5), 0 0 35px rgba(57, 255, 20, 0.3)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            NEON CABINET
          </motion.span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="font-sans text-xs uppercase tracking-wider"
            aria-label="Login (coming soon)"
          >
            <Link href="#">Login</Link>
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}
