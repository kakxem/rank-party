import type { Game } from "@/types";

export const Debug = ({ game }: { game: Game }) => {
  return (
    <div className="absolute bottom-0 right-0 bg-slate-300 p-10">
      <p>
        Id {game.id}, Name: {game.name}, State: {game.state.toString()}
      </p>
    </div>
  );
};
