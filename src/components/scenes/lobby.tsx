import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gameAtom } from "@/hooks/useGame";
import { useAtomValue } from "jotai";
import { useState } from "react";

export const Lobby = () => {
  const game = useAtomValue(gameAtom);
  const [showInactive, setShowInactive] = useState(false);

  return (
    <section className="flex flex-1 justify-between gap-3">
      <aside className="flex max-w-sm flex-1 flex-col gap-3 p-5">
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
                className="flex h-20 items-center gap-3 rounded-md bg-slate-50 p-2 px-3"
              >
                <div className="flex rounded-md border-2 p-5">
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

      <div className="flex flex-1 flex-col justify-between gap-3">
        <section className="h-full w-full p-5">
          <header className="flex gap-2">
            <Input className="max-w-xs" placeholder="Item name" />
            <Input placeholder="Item link" />
            <Button>Add</Button>
          </header>

          {/* Table */}
        </section>

        <Button>Start</Button>
      </div>
    </section>
  );
};
