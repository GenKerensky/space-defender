import { games } from "@/lib/games";
import { GameCard } from "@/components/game-card";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-10 text-center sm:mb-14">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Arcade
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pick a game and play. More classics coming soon.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
