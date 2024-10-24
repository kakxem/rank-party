import type { Game, Player, ResultItem } from "@/types";

// Function to calculate average score for a given item
export const calculateAverageScore = (
  scores: { player: string; score: number }[],
) => {
  const totalScores = scores.reduce((acc, curr) => acc + curr.score, 0);
  return scores.length ? totalScores / scores.length : 0;
};

// Calculate average scores and sort items by average score
export const processedData = (game: Game): ResultItem[] =>
  game.list
    .map((item) => ({
      ...item,
      averageScore: calculateAverageScore(item.score),
    }))
    .sort((a, b) => b.averageScore - a.averageScore); // Sort by averageScore in descending order

export const getSavedPlayer = () => {
  return JSON.parse(
    localStorage.getItem("player") ?? "{id: null, name: null}",
  ) as Pick<Player, "id" | "name">;
};

export const setSavedPlayer = (player: Pick<Player, "id" | "name">) => {
  localStorage.setItem("player", JSON.stringify(player));
};
