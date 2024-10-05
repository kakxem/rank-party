import { showInactivePlayersAtom } from "@/components/sidebar/settings/atoms";
import { Button } from "@/components/ui/button";
import { gameAtom } from "@/hooks/useGame";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

export const Players = () => {
  const game = useAtomValue(gameAtom);
  const showInactivePlayers = useAtomValue(showInactivePlayersAtom);

  return (
    <div className="flex h-full flex-col gap-3">
      <ul className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {game.players.map((player) => {
          if (!showInactivePlayers && !player.active) return null;
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
                <span className="text-end">{player.active ? "🟢" : "🔴"}</span>
              </p>
            </li>
          );
        })}
      </ul>

      <footer className="flex justify-center">
        <Button
          className="text-md w-full font-bold"
          onClick={() => {
            navigator.clipboard.writeText(game.id ?? "???");
            toast.success("Room code copied to clipboard");
          }}
        >
          Copy room code: {game.id}
        </Button>
      </footer>
    </div>
  );
};
