import { gameAtom, wsAtom } from "@/hooks/useGame";
import { Messages, Scene } from "@/types";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

export const EditableRoomName = () => {
  const game = useAtomValue(gameAtom);
  const ws = useAtomValue(wsAtom);
  const roomNameRef = useRef<HTMLHeadingElement>(null);

  const handleInputChange = () => {
    const newName = roomNameRef.current?.innerText || "";

    if (ws && game.id) {
      ws.send(
        JSON.stringify({
          type: Messages.UPDATE_ROOM_NAME,
          data: { roomCode: game.id, newName },
        }),
      );
    }
  };

  useEffect(() => {
    if (roomNameRef.current && roomNameRef.current.innerText !== game.name) {
      roomNameRef.current.innerText = game.name || "Party Rank Group";
    }
  }, [game.name]);

  return (
    <h1
      contentEditable={game.scene === Scene.LOBBY}
      ref={roomNameRef}
      suppressContentEditableWarning
      onBlur={handleInputChange}
      className="text-4xl font-semibold"
    >
      {game.name || "Party Rank Group"}
    </h1>
  );
};
