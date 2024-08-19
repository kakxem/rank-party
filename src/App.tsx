import { Debug } from "@/components/debug";
import EditableRoomName from "@/components/editable-room-name";
import { gameAtom, useGame } from "@/hooks/useGame";
import { Game } from "@/modules/game";
import { Lobby } from "@/modules/lobby";
import { Main } from "@/modules/main";
import { Result } from "@/modules/result";
import { Scene } from "@/types";
import { useAtomValue } from "jotai";
import { Toaster } from "sonner";

function App() {
  useGame();
  const game = useAtomValue(gameAtom);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-center pt-5">
          <EditableRoomName />
          {game.scene !== Scene.MAIN && (
            <p className="text-md absolute right-20 font-bold">
              Game ID: {game.id}
            </p>
          )}
        </header>

        <main className="container flex h-full flex-1 px-10 py-5">
          {game.scene === Scene.MAIN && <Main />}
          {game.scene === Scene.LOBBY && <Lobby />}
          {game.scene === Scene.GAME && <Game />}
          {game.scene === Scene.RESULT && <Result />}
        </main>

        <footer className="p-5">footer</footer>
      </div>

      <Toaster richColors />
      <Debug game={game} />
    </>
  );
}

export default App;
