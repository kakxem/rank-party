import { Button } from "@/components/ui/button";
import { gameAtom, wsAtom } from "@/hooks/useGame";
import { cn } from "@/lib/utils";
import { Messages } from "@/types";
import "@justinribeiro/lite-youtube";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

const YOUTUBE_REGEX =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

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
        <h2 className="text-5xl font-bold">{actualItem.name}</h2>
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

        <p className="text-3xl">
          {alreadyVoted}/{activePlayers}
        </p>

        {alreadyVoted === activePlayers && (
          <p className="text-3xl">Time left: {remainingTime}</p>
        )}
      </div>
    </section>
  );
};
