export interface Game {
  id: string;
  name: string;
  description: string;
  href: string;
  thumbnail: string;
}

export const games: Game[] = [
  {
    id: "space-defender",
    name: "Space Defender",
    description:
      "Defend the galaxy from endless waves of asteroids. Blaster, laser, and missile weapons.",
    href: "/games/space-defender",
    thumbnail: "/assets/space-defender-thumb.svg",
  },
];
