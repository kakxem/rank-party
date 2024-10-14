import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { gameAtom, wsAtom } from "@/hooks/useGame";
import { ItemsTable } from "@/modules/lobby/components/items-table";
import { Messages, Role } from "@/types";
import { useAtomValue } from "jotai";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const Lobby = () => {
  const ws = useAtomValue(wsAtom);
  const game = useAtomValue(gameAtom);
  const currentPlayer = useCurrentPlayer();

  const handleStart = () => {
    ws?.send(
      JSON.stringify({
        type: Messages.START_GAME,
      }),
    );
  };

  return (
    <section className="flex flex-1 justify-between gap-3 rounded-xl">
      <Sidebar />

      <div className="flex w-full flex-1 flex-col">
        <ItemsTable />
        <div className="flex justify-center gap-3">
          <Button
            variant="secondary"
            className="text-md w-fit gap-2 px-10 font-bold"
            onClick={() => {
              navigator.clipboard.writeText(game.id ?? "???");
              toast.success("Room code copied to clipboard");
            }}
          >
            <Copy className="h-4 w-4" /> <span>Copy room code</span>
          </Button>
          {currentPlayer?.role === Role.ADMIN && (
            <Button
              className="text-md w-fit font-extrabold sm:w-52"
              onClick={handleStart}
            >
              START
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
