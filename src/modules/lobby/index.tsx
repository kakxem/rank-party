import { Button } from "@/components/ui/button";
import { wsAtom } from "@/hooks/useGame";
import { ItemsTable } from "@/modules/lobby/components/items-table";
import { Messages } from "@/types";
import { useAtomValue } from "jotai";

export const Lobby = () => {
  const ws = useAtomValue(wsAtom);

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
      <Button onClick={handleStart}>Start</Button>
    </section>
  );
};
