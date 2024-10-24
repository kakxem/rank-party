import { gameAtom } from "@/hooks/use-game";
import { getSavedPlayer } from "@/lib/game";
import { Player } from "@/types";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export const useCurrentPlayer = (): Player | undefined => {
  const game = useAtomValue(gameAtom);

  const currentPlayer = useMemo(() => {
    const savedPlayer = getSavedPlayer();
    return game.players.find((player) => player.id === savedPlayer?.id);
  }, [game.players]);

  return currentPlayer;
};
