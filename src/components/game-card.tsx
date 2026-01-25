"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Game } from "@/lib/games";

interface GameCardProps {
  game: Game;
  index?: number;
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
    >
      <Link href={game.href} className="group block">
        <motion.div
          className="cabinet-card overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Game thumbnail with cabinet screen effect */}
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {/* Screen bezel effect */}
            <div className="absolute inset-0 z-10 rounded-t-lg border-b-4 border-nc-bg-tertiary shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />

            {/* Scanline overlay */}
            <div
              className="pointer-events-none absolute inset-0 z-20 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
              }}
            />

            <motion.div
              className="relative h-full w-full"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Image
                src={game.thumbnail}
                alt={game.name}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Hover glow overlay */}
            <motion.div
              className="absolute inset-0 z-30 bg-gradient-to-t from-nc-neon-purple/20 to-transparent opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Card content */}
          <CardHeader className="relative">
            {/* Neon accent line */}
            <motion.div
              className="absolute left-5 right-5 top-0 h-[2px] bg-nc-neon-purple opacity-50"
              whileHover={{
                opacity: 1,
                boxShadow: "0 0 10px rgba(176, 38, 255, 0.6)",
              }}
            />

            <CardTitle className="transition-colors duration-200 group-hover:text-nc-neon-green">
              {game.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {game.description}
            </CardDescription>
          </CardHeader>
        </motion.div>
      </Link>
    </motion.div>
  );
}
