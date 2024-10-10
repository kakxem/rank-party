import { gameAtom } from "@/hooks/useGame";
import { Player } from "@/types";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export const useCurrentPlayer = (): Player | undefined => {
  const game = useAtomValue(gameAtom);

  const currentPlayer = useMemo(() => {
    const { id } = JSON.parse(localStorage.getItem("player") ?? "{}");
    return game.players.find((player) => player.id === id);
  }, [game.players]);

  return currentPlayer;
};
