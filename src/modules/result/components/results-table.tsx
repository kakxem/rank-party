import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gameAtom } from "@/hooks/useGame";
import type { Item } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useAtomValue } from "jotai";

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
        return <div className="max-w-md truncate">{name}</div>;
      },
    },
    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }) => {
        const link = row.getValue("link") as string;
        return (
          <div className="max-w-xs truncate">
            <a
              className="truncate underline"
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              {link}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => {
        const scores = row.getValue("score") as {
          player: string;
          score: number;
        }[];

        // Calculate the average score
        const totalScores = scores.reduce((acc, curr) => acc + curr.score, 0);
        const averageScore = scores.length ? totalScores / scores.length : 0;

        // Encuentra el jugador correspondiente al identificador
        const findPlayerById = (id: string) =>
          game.players.find((player) => player.id === id);

        // Ordena las puntuaciones en orden descendente por puntuación
        const sortedScores = scores.sort((a, b) => b.score - a.score);

        // Mapea los valores de la puntuación a un array que contiene el nombre y la puntuación
        const tooltipContent = sortedScores.map((s) => {
          const player = findPlayerById(s.player);
          const playerName = player ? player.name : "Unknown Player"; // Reemplaza 'Unknown Player' si el jugador no se encuentra

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
      <div className="py-5">
        <DataTable columns={columns} data={processedData} />
      </div>
    </section>
  );
};
