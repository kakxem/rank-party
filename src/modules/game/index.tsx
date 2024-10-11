import { Button } from "@/components/ui/button";
import { gameAtom, wsAtom } from "@/hooks/useGame";
import { YOUTUBE_REGEX } from "@/lib/regex";
import { cn } from "@/lib/utils";
import { Messages } from "@/types";
import "@justinribeiro/lite-youtube";
import { useAtomValue } from "jotai";
import { Clock, Users } from "lucide-react"; // Add Clock import
import { useEffect, useState } from "react";

export const Game = () => {
  const game = useAtomValue(gameAtom);
  const ws = useAtomValue(wsAtom);
  const [videoId, setVideoId] = useState("");
  const [lastItem, setLastItem] = useState<string | null>(null);
  const [activePlayers, setActivePlayers] = useState(0);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(10);

  const alreadyVoted = game?.list[game?.state?.actualItem]?.score?.length;
  const actualItem = game?.list[game?.state?.actualItem];
  const totalItems = game?.list?.length || 0;
  const currentItemNumber = (game?.state?.actualItem || 0) + 1;

  useEffect(() => {
    // Reset if the actual item changes
    if (actualItem && actualItem.id !== lastItem) {
      // Set the video id
      if (YOUTUBE_REGEX.test(actualItem.link)) {
        const id = actualItem.link.match(YOUTUBE_REGEX)?.[1];
        setVideoId(id ?? "");
      }

      // Restart the game
      const activePlayers = game.players.filter((player) => player.active);
      setActivePlayers(activePlayers.length);
      setRemainingTime(10);
      setSelectedScore(null);
      setLastItem(actualItem.id);
    }
  }, [actualItem, game.players, lastItem]);

  useEffect(() => {
    // Set the remaining time
    if (alreadyVoted === activePlayers) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
        if (remainingTime === 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activePlayers, alreadyVoted, remainingTime]);

  useEffect(() => {
    if (selectedScore) {
      ws?.send(
        JSON.stringify({
          type: Messages.ADD_SCORE,
          data: { score: selectedScore },
        }),
      );
    }
  }, [selectedScore, ws]);

  return (
    <section className="flex flex-1 flex-col rounded-xl">
      <section className="flex grow flex-col items-center justify-center gap-5">
        <div className="text-center">
          <h2 className="text-5xl font-bold">{actualItem.name}</h2>
          <div className="mt-2 flex items-center justify-center gap-2 text-xl text-gray-500">
            <span>
              {currentItemNumber} of {totalItems}
            </span>
            <span className="mx-2">•</span>
            <Users className="h-5 w-5" />
            <span>
              {alreadyVoted}/{activePlayers}
            </span>
            {alreadyVoted === activePlayers && (
              <>
                <span className="mx-2">•</span>
                <Clock className="h-5 w-5" />
                <span>{remainingTime}s</span>
              </>
            )}
          </div>
        </div>
        <div className="flex aspect-video w-full max-w-5xl shadow-2xl transition-transform">
          <lite-youtube
            videoid={videoId}
            videotitle={actualItem.name}
            style={{ borderRadius: "0.25rem" }}
          />
        </div>
      </section>

      <div className="relative flex grow flex-col flex-wrap justify-between px-10">
        <div className="flex flex-wrap justify-center gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Button
              key={index + 1}
              className={cn(
                "transition-scale h-20 w-20 select-none border text-3xl shadow-md hover:scale-110",
                selectedScore === index + 1 && "scale-110 bg-accent",
              )}
              variant="ghost"
              onClick={() => setSelectedScore(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
