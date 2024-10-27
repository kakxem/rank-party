import { Messages, Scene, type Game } from "@/types";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";

const DEFAULT_GAME: Game = {
  id: undefined,
  scene: Scene.MAIN,
  name: undefined,
  players: [],
  list: [],
  state: {
    actualItem: 0,
    executingTimeout: false,
  },
  settings: {
    timeout: 3,
    blacklist: [],
  },
};

export const wsAtom = atom<WebSocket | null>(null);
export const gameAtom = atom<Game>(DEFAULT_GAME);

export const useGame = () => {
  const ws = useAtomValue(wsAtom);
  const setGame = useSetAtom(gameAtom);

  // Add beforeunload event listener
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = true;
  };

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => {
      const url = new URL(ws.url);
      const id = url.pathname.split("/").pop();
      setGame((prev) => ({ ...prev, id }));
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
      setGame(DEFAULT_GAME);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      ws.close();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setGame, ws]);
};
