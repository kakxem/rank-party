import { Button } from "@/components/ui/button";
import { gameAtom, wsAtom } from "@/hooks/useGame";
import { getSavedPlayer } from "@/lib/game";
import { Messages, type Item } from "@/types";
import { useAtomValue } from "jotai";
import { FileDown } from "lucide-react";
export const ImportButton = () => {
  const ws = useAtomValue(wsAtom);
  const game = useAtomValue(gameAtom);
  const handleImportList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Show file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        if (!reader.result) return;
        const data = JSON.parse(reader.result as string);
        if (!data) return;

        // overwrite 'createdBy' in case the player is not in the game
        const savedPlayer = getSavedPlayer();
        const { id } = savedPlayer;

        const parsedData = data.map((item: Item) => {
          const isPlayerInGame = game.players.some(
            (player) => player.id === item.createdBy,
          );
          if (isPlayerInGame) return item;

          return {
            ...item,
            createdBy: id,
          };
        });

        if (ws) {
          ws.send(
            JSON.stringify({
              type: Messages.IMPORT_LIST,
              data: { list: parsedData },
            }),
          );
        }
      };
    };
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleImportList}>
      <FileDown className="mr-1 h-4 w-4" /> Import
    </Button>
  );
};
