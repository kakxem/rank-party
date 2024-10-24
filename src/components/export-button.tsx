import { Button } from "@/components/ui/button";
import { gameAtom } from "@/hooks/use-game";
import { useAtomValue } from "jotai";
import { FileUp } from "lucide-react";

export const ExportButton = () => {
  const game = useAtomValue(gameAtom);

  const handleExportList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data = game.list;

    // JSON
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleExportList}>
      <FileUp className="mr-1 h-4 w-4" /> Export
    </Button>
  );
};
