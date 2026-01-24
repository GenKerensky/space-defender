"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type { IRefPhaserGame } from "@/game/PhaserGame";

const PhaserGame = dynamic(
  () =>
    import("@/game/PhaserGame").then((mod) => ({ default: mod.PhaserGame })),
  { ssr: false },
);

export default function SpaceDefenderPage() {
  const phaserRef = useRef<IRefPhaserGame>({
    game: undefined,
    scene: undefined,
  });

  const onCurrentActiveScene = (_scene: Phaser.Scene) => {
    // Scene ready; can use for React bridge if needed.
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full [&_#phaser-game]:h-full">
      <PhaserGame ref={phaserRef} currentActiveScene={onCurrentActiveScene} />
    </div>
  );
}
