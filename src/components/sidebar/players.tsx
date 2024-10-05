import { showInactivePlayersAtom } from "@/components/sidebar/settings/atoms";
import { Button } from "@/components/ui/button";
import { gameAtom } from "@/hooks/useGame";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useAtomValue } from "jotai";
import { Crown, User } from "lucide-react";
import { toast } from "sonner";

export const Players = () => {
  const game = useAtomValue(gameAtom);
  const showInactivePlayers = useAtomValue(showInactivePlayersAtom);

  return (
    <div className="flex h-full flex-col gap-3">
      <ul className="mt-3 flex flex-1 flex-col gap-3 overflow-y-auto">
        {game.players.map((player) => {
          if (!showInactivePlayers && !player.active) return null;
          return (
            <li
              key={player.id}
              className={cn(
                "flex h-16 items-center gap-3 rounded-md p-2 px-3",
                player.active &&
                  "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300",
                !player.active &&
                  "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300",
                player.role === Role.ADMIN &&
                  "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
              )}
              aria-label={`${player.name}, ${player.role.toLowerCase()}, ${player.active ? "active" : "inactive"}`}
            >
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-current">
                    {player.role === Role.ADMIN ? (
                      <Crown size={24} aria-hidden="true" />
                    ) : (
                      <User size={24} aria-hidden="true" />
                    )}
                  </span>
                  <span className="font-medium">{player.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {player.active ? "Active" : "Inactive"}
                </span>
              </div>
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
