import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { wsAtom } from "@/hooks/useGame";
import type { ConnectionData } from "@/types";
import { useSetAtom } from "jotai";
import { useState } from "react";

export const Main = () => {
  const setWs = useSetAtom(wsAtom);
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreate = () => {
    if (!playerName) return;

    const data: ConnectionData = {
      player: {
        id: String(Math.floor(Math.random() * 1000000000)),
        name: playerName,
      },
      roomCode: Math.random().toString(36).slice(2, 8),
    };

    const ws = new WebSocket(
      `ws://localhost:5000?data=${JSON.stringify(data)}`,
    );
    setWs(ws);
  };

  const handleJoin = () => {
    if (!playerName || !roomCode) return;

    const data: ConnectionData = {
      player: {
        id: String(Math.floor(Math.random() * 1000000000)),
        name: playerName,
      },
      roomCode,
    };

    const ws = new WebSocket(
      `ws://localhost:5000/join?data=${JSON.stringify(data)}`,
    );
    setWs(ws);
  };

  return (
    <section className="flex flex-1 flex-col justify-center gap-20">
      <div className="flex justify-center gap-5">
        <Input
          placeholder="Player name"
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-80"
        />
      </div>

      <div className="flex flex-col items-center gap-5">
        <Button className="w-72" onClick={handleCreate}>
          Create
        </Button>

        <div className="flex w-72 gap-5">
          <Input
            placeholder="Room code"
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-56"
          />
          <Button onClick={handleJoin}>Join</Button>
        </div>
      </div>
    </section>
  );
};
