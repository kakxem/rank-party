import { Button } from "@/components/ui/button";
import { gameAtom } from "@/hooks/useGame";
import { ItemsTable } from "@/modules/lobby/components/items-table";
import { useAtomValue } from "jotai";
import { useState } from "react";

export const Lobby = () => {
  const game = useAtomValue(gameAtom);
  const [showInactive, setShowInactive] = useState(false);

  return (
    <section className="flex flex-1 justify-between gap-3">
      <aside className="flex max-w-sm flex-1 flex-col gap-3 rounded-xl bg-slate-100 p-5 dark:bg-slate-900">
        <header className="flex justify-between">
          <h2 className="flex items-center text-xl font-bold">Players</h2>

          <Button onClick={() => setShowInactive(!showInactive)}>
            {showInactive ? "Hide inactive" : "Show inactive"}
          </Button>
        </header>

        <ul className="flex flex-col gap-3">
          {game.players.map((player) => {
            if (!showInactive && !player.active) return null;

            return (
              <li
                key={player.id}
                className="flex h-20 items-center gap-3 rounded-md bg-slate-200 p-2 px-3 dark:bg-slate-800"
              >
                <div className="flex rounded-md border-2 p-5 dark:border-slate-700">
                  {player.name.slice(0, 1).toUpperCase()}
                </div>
                <p className="flex flex-1 justify-between">
                  {player.name}
                  <span className="text-end">
                    {player.active ? "🟢" : "🔴"}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex flex-1 flex-col justify-between gap-3 rounded-xl bg-slate-100 p-5 dark:bg-slate-900">
        <ItemsTable />
        <Button>Start</Button>
      </div>
    </section>
  );
};
