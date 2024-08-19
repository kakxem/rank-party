import type { Game } from "@/types";

export const Debug = ({ game }: { game: Game }) => {
  return (
    <div className="absolute bottom-0 right-0 border bg-slate-300 p-10 dark:bg-black">
      <p>{JSON.stringify(game, null, 2)}</p>
    </div>
  );
};
