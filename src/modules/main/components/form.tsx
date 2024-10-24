import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { wsAtom } from "@/hooks/use-game";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getSavedPlayer, setSavedPlayer } from "@/lib/game";
import { cn } from "@/lib/utils";
import type { ConnectionData } from "@/types";
import { Label } from "@radix-ui/react-label";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  dialogInfoAtom,
  FormType,
  formTypeAtom,
  openFormAtom,
} from "../hooks/use-form-dialog";

export const Form = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formType = useAtomValue(formTypeAtom);
  const [dialogInfo, setDialogInfo] = useAtom(dialogInfoAtom);
  const [open, setOpen] = useAtom(openFormAtom);
  const setWs = useSetAtom(wsAtom);

  const isJoin = formType === FormType.JOIN;
  const title = isJoin ? "Join Room" : "Create Room";
  const description = isJoin
    ? "Enter your username and the room ID to join an existing room."
    : "Enter your username and create a new room.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { playerName, roomCode } = dialogInfo;

    if (!playerName || (isJoin && !roomCode)) return;

    const createPlayer = () => {
      const savedPlayer = getSavedPlayer();
      const newPlayer = {
        id: savedPlayer?.id ?? uuidv4(),
        name: playerName,
      };
      setSavedPlayer(newPlayer);
      return newPlayer;
    };

    const data: ConnectionData = {
      player: createPlayer(),
      join: isJoin,
    };
    const roomId = isJoin ? roomCode : Math.random().toString(36).slice(2, 8);

    const host = import.meta.env.VITE_WS_HOST ?? "ws://127.0.0.1:1999";
    const ws = new WebSocket(
      `${host}/party/${roomId}?data=${encodeURIComponent(
        JSON.stringify(data),
      )}`,
    );
    setWs(ws);
  };

  useEffect(() => {
    const savedPlayer = getSavedPlayer();
    if (savedPlayer?.name)
      setDialogInfo((prev) => ({ ...prev, playerName: savedPlayer.name }));
  }, [setDialogInfo]);

  return (
    <ResponsiveDialog
      title={title}
      description={description}
      open={open}
      setOpen={setOpen}
    >
      <form
        className={cn("grid items-start gap-7 px-4", isDesktop && "gap-3")}
        onSubmit={handleSubmit}
      >
        <div className="flex w-full gap-2">
          <div className="flex w-full flex-col gap-1">
            <Label>Username</Label>
            <Input
              id="username"
              placeholder="Enter Username"
              onChange={(e) =>
                setDialogInfo((prev) => ({
                  ...prev,
                  playerName: e.target.value,
                }))
              }
              value={dialogInfo.playerName}
              className="w-full"
              autoComplete="off"
            />
          </div>

          {isJoin && (
            <div className="flex w-full flex-col gap-1">
              <Label>Room ID</Label>
              <Input
                id="id"
                placeholder="Enter Room ID"
                onChange={(e) =>
                  setDialogInfo((prev) => ({
                    ...prev,
                    roomCode: e.target.value,
                  }))
                }
                value={dialogInfo.roomCode}
                className="w-full"
                autoComplete="off"
              />
            </div>
          )}
        </div>
        <Button type="submit">{isJoin ? "Join" : "Create"}</Button>
      </form>
    </ResponsiveDialog>
  );
};
