import { Button } from "@/components/ui/button";
import { wsAtom } from "@/hooks/useGame";
import { Messages } from "@/types";
import { useAtomValue } from "jotai";
import { ArrowLeft } from "lucide-react";

export const BackToLobbyButton = () => {
  const ws = useAtomValue(wsAtom);

  const handleBackToLobby = () => {
    ws?.send(
      JSON.stringify({
        type: Messages.BACK_TO_LOBBY,
      }),
    );
  };

  return (
    <Button variant="outline" onClick={handleBackToLobby}>
      <ArrowLeft className="mr-2 h-4 w-4" /> Back to lobby
    </Button>
  );
};
