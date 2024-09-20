import { Button } from "@/components/ui/button";
import { gameAtom } from "@/hooks/useGame";
import { processedData } from "@/lib/game";
import type { ResultItem } from "@/types";
import { useAtomValue } from "jotai";
import { Download } from "lucide-react";

export const DownloadButton = () => {
  const game = useAtomValue(gameAtom);

  const processResultsData = (data: ResultItem[]) => {
    const csvData = data.map((item) => {
      // Get the scores sorted by player name
      const scores = item.score
        .sort((a, b) => a.player.localeCompare(b.player))
        .map((score) => score.score);

      return `${item.name},${item.link},${item.createdBy},${item.averageScore},${scores.join(",")}`;
    });

    // Get the player names sorted alphabetically
    const players = game.players
      .map((player) => player.name)
      .sort((a, b) => a.localeCompare(b));
    const csvHeader = `Name,Link,Created By,Average Score,${players.join(",")}`;
    csvData.unshift(csvHeader);

    return csvData.join("\n");
  };
  const downloadResults = () => {
    // Download in CSV format
    const csvData = processResultsData(processedData(game));
    const csvFile = new Blob([csvData], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvFile);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = "results.csv";
    link.click();
    URL.revokeObjectURL(csvUrl);
  };

  return (
    <Button variant="outline" onClick={downloadResults}>
      <Download className="mr-1 h-4 w-4" /> Download
    </Button>
  );
};
