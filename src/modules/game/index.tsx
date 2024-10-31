import { Button } from "@/components/ui/button";
import { gameAtom, wsAtom } from "@/hooks/use-game";
import { getProxyImageUrl } from "@/lib/image-proxy";
import { YOUTUBE_REGEX } from "@/lib/regex";
import { cn } from "@/lib/utils";
import { Messages } from "@/types";
import "@justinribeiro/lite-youtube";
import { useAtomValue } from "jotai";
import { Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";

export const Game = () => {
  const game = useAtomValue(gameAtom);
  const ws = useAtomValue(wsAtom);

  const [videoId, setVideoId] = useState("");
  const [lastItem, setLastItem] = useState<string | null>(null);
  const [activePlayers, setActivePlayers] = useState(0);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(5);

  const actualItem = game?.list[game?.state?.actualItem];
  const totalItems = game?.list?.length || 0;
  const currentItemNumber = (game?.state?.actualItem || 0) + 1;
  const alreadyVoted = actualItem?.score?.length;

  useEffect(() => {
    // Reset if the actual item changes
    if (actualItem && actualItem.id !== lastItem) {
      // Set the video id
      const id = YOUTUBE_REGEX.test(actualItem.link)
        ? actualItem.link.match(YOUTUBE_REGEX)?.[1]
        : "";
      setVideoId(id ?? "");

      // Restart the game
      const activePlayers = game.players.filter((player) => player.active);
      setActivePlayers(activePlayers.length);
      setRemainingTime(game.settings.timeout);
      setSelectedScore(null);
      setLastItem(actualItem.id);
    }
  }, [actualItem, game.players, game.settings, lastItem]);

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
    <section className="flex flex-1 flex-col gap-2 rounded-xl">
      <section className="flex grow flex-col items-center justify-center gap-2">
        <div className="text-center">
          <h2 className="max-w-[90vw] truncate p-4 text-4xl font-bold md:max-w-2xl lg:max-w-4xl lg:text-5xl">
            {actualItem.name}
          </h2>

          <div className="flex items-center justify-center gap-1 text-base text-gray-500 md:text-xl">
            <span>
              {currentItemNumber} of {totalItems}
            </span>
            <span className="mx-2">•</span>
            <Users className="h-4 w-4 md:h-5 md:w-5" />
            <span>
              {alreadyVoted}/{activePlayers}
            </span>

            {alreadyVoted === activePlayers && (
              <>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 md:h-5 md:w-5" />
                <span>{remainingTime}s</span>
              </>
            )}
          </div>
        </div>

        <div className="flex aspect-video w-full max-w-[90vw] items-center justify-center rounded-lg sm:rounded-xl md:max-w-5xl">
          {videoId ? (
            <lite-youtube
              videoid={videoId}
              videotitle={actualItem.name}
              style={{ borderRadius: "var(--radius)" }}
            />
          ) : (
            <img
              src={getProxyImageUrl(actualItem.link)}
              alt={actualItem.name}
              className="h-full rounded-lg object-contain"
            />
          )}
        </div>

        <p className="text-center text-xs italic text-gray-500 sm:text-sm md:text-base">
          Added by{" "}
          <span className="font-bold">
            {
              game.players.find((player) => player.id === actualItem?.createdBy)
                ?.name
            }
          </span>
        </p>
      </section>

      <section className="relative flex grow flex-col flex-wrap justify-between">
        <div className="flex flex-wrap justify-center gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Button
              key={index + 1}
              className={cn(
                "size-14 border bg-background text-3xl shadow hover:bg-accent/10 md:size-20",
                selectedScore === index + 1 &&
                  "scale-110 bg-accent shadow-md hover:bg-accent/90",
              )}
              variant="outline"
              onClick={() => setSelectedScore(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </section>
    </section>
  );
};
