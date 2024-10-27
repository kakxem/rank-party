import { Button } from "@/components/ui/button";
import { useCurrentPlayer } from "@/hooks/use-current-player";
import { gameAtom, wsAtom } from "@/hooks/use-game";
import { cn } from "@/lib/utils";
import { Messages, Role, type Settings } from "@/types";
import { useAtomValue } from "jotai";
import { User, X } from "lucide-react";

export const ManageBlacklist = () => {
  const game = useAtomValue(gameAtom);
  const ws = useAtomValue(wsAtom);
  const currentPlayer = useCurrentPlayer();

  const isAdmin = currentPlayer?.role === Role.ADMIN;

  if (!isAdmin) return null;

  const handleRemoveFromBlacklist = (playerId: string) => {
    const settings: Partial<Settings> = {
      blacklist: game.settings.blacklist.filter((id) => id !== playerId),
    };

    ws?.send(
      JSON.stringify({
        type: Messages.UPDATE_SETTINGS,
        data: settings,
      }),
    );
  };

  return (
    <div className="flex flex-col items-start">
      <h3 className="mb-2 text-lg font-semibold">Blocked Players</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        List of players that are not allowed to join the game.
      </p>
      {game.settings.blacklist.length === 0 ? (
        <p className="w-full text-center font-medium text-muted-foreground">
          No blocked players.
        </p>
      ) : (
        <ul className="w-full space-y-2">
          {game.settings.blacklist.map((playerId) => {
            // Find player name from game history
            const playerName =
              game.players.find((p) => p.id === playerId)?.name || playerId;

            return (
              <li
                key={playerId}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-md p-2 px-3",
                  "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300",
                )}
              >
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-current">
                      <User size={24} aria-hidden="true" />
                    </span>
                    <span className="font-medium">{playerName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-fit w-fit p-2 text-red-500 hover:bg-red-500/10 hover:text-red-700"
                    onClick={() => handleRemoveFromBlacklist(playerId)}
                  >
                    <X size={16} aria-hidden="true" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
