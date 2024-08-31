import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gameAtom } from "@/hooks/useGame";
import type { Item, PlayerScore } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useAtomValue } from "jotai";
import { Download } from "lucide-react";

export const ResultsTable = () => {
  const game = useAtomValue(gameAtom);

  // Function to calculate average score for a given item
  const calculateAverageScore = (
    scores: { player: string; score: number }[],
  ) => {
    const totalScores = scores.reduce((acc, curr) => acc + curr.score, 0);
    return scores.length ? totalScores / scores.length : 0;
  };

  // Calculate average scores and sort items by average score
  const processedData = game.list
    .map((item) => ({
      ...item,
      averageScore: calculateAverageScore(item.score),
    }))
    .sort((a, b) => b.averageScore - a.averageScore); // Sort by averageScore in descending order

  const processResultsData = (data: Item[]) => {
    const csvData = data.map((item) => {
      // Get the scores sorted by player name
      const scores = item.score
        .sort((a, b) => a.player.localeCompare(b.player))
        .map((score) => score.score);

      const averageScore = calculateAverageScore(item.score);
      const data = `${item.name},${item.link},${item.createdBy},${averageScore},${scores.join(",")}`;

      return data;
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
    const csvData = processResultsData(processedData);
    const csvFile = new Blob([csvData], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvFile);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = "results.csv";
    link.click();
    URL.revokeObjectURL(csvUrl);
  };

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "index",
      header: "No.",
      cell: ({ row }) => (
        <div className="text-center">
          {row.index + 1} {/* Display the row index + 1 */}
        </div>
      ),
      meta: {
        isNumeric: true,
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const link = row.original.link;

        return (
          <div className="max-w-lg truncate">
            <a
              className="truncate underline"
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              {name}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => {
        const scores = row.getValue("score") as PlayerScore[];

        // Calculate the average score
        const totalScores = scores.reduce((acc, curr) => acc + curr.score, 0);
        const averageScore = scores.length ? totalScores / scores.length : 0;

        // Find the player corresponding to the identifier
        const findPlayerById = (id: string) =>
          game.players.find((player) => player.id === id);

        // Sort the scores in descending order by score
        const sortedScores = scores.sort((a, b) => b.score - a.score);

        // Create an array of objects containing the name and score
        const tooltipContent = sortedScores.map((s) => {
          const player = findPlayerById(s.player);
          const playerName = player ? player.name : "Unknown Player"; // Replace 'Unknown Player' if the player is not found

          return (
            <div key={s.player}>
              {playerName}: {s.score}
            </div>
          );
        });

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="max-w-xs">
                  {averageScore.toFixed(2)} {/* Display the average score */}
                </div>
              </TooltipTrigger>
              <TooltipContent>{tooltipContent}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <section className="h-full w-full p-5">
      <header className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadResults}>
            <Download className="mr-1 h-4 w-4" /> Download
          </Button>
        </div>
      </header>
      <div className="py-5">
        <DataTable columns={columns} data={processedData} />
      </div>
    </section>
  );
};
