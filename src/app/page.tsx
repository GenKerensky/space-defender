"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { IRefPhaserGame } from "../game/PhaserGame";

const PhaserGame = dynamic(
  () =>
    import("../game/PhaserGame").then((mod) => ({ default: mod.PhaserGame })),
  {
    ssr: false,
  },
);

export default function Home() {
  const phaserRef = useRef<IRefPhaserGame>({
    game: undefined,
    scene: undefined,
  });

  const onCurrentActiveScene = (_scene: Phaser.Scene) => {
    // Scene is ready, can access it here if needed
  };

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PhaserGame ref={phaserRef} currentActiveScene={onCurrentActiveScene} />
    </main>
  );
}
