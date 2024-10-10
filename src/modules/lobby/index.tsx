import { Button } from "@/components/ui/button";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { gameAtom, wsAtom } from "@/hooks/useGame";
import { ItemsTable } from "@/modules/lobby/components/items-table";
import { Messages, Role } from "@/types";
import { useAtomValue } from "jotai";
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
    <section className="flex flex-1 flex-col justify-between gap-3 rounded-xl">
      <ItemsTable />
      <div className="flex justify-center gap-3">
        <Button
          className="text-md w-fit px-10 font-bold"
          onClick={() => {
            navigator.clipboard.writeText(game.id ?? "???");
            toast.success("Room code copied to clipboard");
          }}
        >
          Room code: {game.id}
        </Button>
        <Button
          className="text-md w-full font-bold"
          onClick={handleStart}
          disabled={currentPlayer?.role === Role.ADMIN}
        >
          Start
        </Button>
      </div>
    </section>
  );
};
