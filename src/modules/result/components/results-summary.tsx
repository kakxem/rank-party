import { gameAtom } from "@/hooks/use-game";
import { processedData } from "@/lib/game";
import { getProxyImageUrl } from "@/lib/image-proxy";
import { YOUTUBE_REGEX } from "@/lib/regex";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const getRankColor = (rank: number) => {
  const colors = ["text-yellow-500", "text-gray-400", "text-amber-600"];
  return colors[rank - 1] || "";
};

const SummaryCard = ({
  rank,
  name,
  score,
  thumbnailUrl,
}: {
  rank: number;
  name: string;
  score: string;
  thumbnailUrl: string;
}) => (
  <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
    <header className="relative flex-shrink-0">
      <figure>
        <img
          src={getProxyImageUrl(thumbnailUrl)}
          alt={name}
          className="h-32 w-full object-cover sm:h-48"
        />
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent to-black/50" />
        <figcaption className="absolute left-2 top-2 rounded-full bg-white p-2 shadow-md">
          <span
            className={cn("text-xl font-bold sm:text-2xl", getRankColor(rank))}
          >
            #{rank}
          </span>
        </figcaption>
      </figure>
    </header>

    <section className="flex flex-grow flex-col justify-between p-2 sm:p-4">
      <h3 className="line-clamp-2 text-center text-sm font-semibold text-gray-800 sm:text-xl">
        {name}
      </h3>
      <div className="mt-1 text-center sm:mt-2">
        <data
          value={score}
          className={cn("text-xl font-bold sm:text-2xl", getRankColor(rank))}
        >
          {score}
        </data>
      </div>
    </section>
  </article>
);

export const ResultsSummary = () => {
  const game = useAtomValue(gameAtom);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  const topItems = useMemo(() => {
    const items = processedData(game);
    return items.slice(0, 3).map((item) => ({
      ...item,
      avgScore: item.averageScore.toFixed(2),
      thumbnailUrl: YOUTUBE_REGEX.test(item.link)
        ? `https://img.youtube.com/vi/${item.link.match(YOUTUBE_REGEX)?.[1]}/0.jpg`
        : item.link,
    }));
  }, [game]);

  useEffect(() => {
    const showCard = (index: number) => {
      setVisibleCards((prev) => [...prev, index]);
    };

    const timeouts = [
      setTimeout(() => showCard(2), 0),
      setTimeout(() => showCard(1), 1500),
      setTimeout(() => showCard(0), 3000),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex h-full items-center justify-center p-2 sm:p-4">
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-4 sm:flex-row sm:items-end sm:gap-8">
        {topItems.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "w-full max-w-[250px] transition-opacity duration-500 sm:max-w-sm",
              index === 0 && "order-first sm:order-2 sm:mb-8",
              index === 1 && "sm:order-1",
              index === 2 && "sm:order-3",
              visibleCards.includes(index) ? "opacity-100" : "opacity-0",
            )}
          >
            <SummaryCard
              rank={index + 1}
              name={item.name}
              score={item.avgScore}
              thumbnailUrl={item.thumbnailUrl}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-gray-600" />
      </div>
    </div>
  );
};
