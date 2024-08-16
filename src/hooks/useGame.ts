import { Messages, Scene, type Game } from "@/types";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";

export const wsAtom = atom<WebSocket | null>(null);
export const gameAtom = atom<Game>({
  id: undefined,
  scene: Scene.MAIN,
  name: undefined,
  players: [],
  list: [],
  state: false,
});

export const useGame = () => {
  const ws = useAtomValue(wsAtom);
  const setGame = useSetAtom(gameAtom);

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => {
      console.log("open");
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      if (type === Messages.UPDATE_CLIENT) {
        setGame((prev) => ({ ...prev, ...data }));
      }

      if (type === Messages.ERROR) {
        toast.error(data.message);
      }
    };

    ws.onclose = () => {
      console.log("close");
    };

    return () => {
      ws.close();
    };
  }, [setGame, ws]);
};
