import { Debug } from "@/components/debug";
import { EditableRoomName } from "@/components/editable-room-name";
import { Sidebar } from "@/components/sidebar/sidebar";
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
    <div className="flex h-screen flex-col justify-center">
      <div className="flex h-full max-h-[65rem] flex-col">
        <header className="flex flex-shrink-0 items-center justify-center px-10 pt-5">
          <EditableRoomName />
        </header>

        <main className="container flex flex-grow gap-4 overflow-y-auto px-10 py-3">
          {![Scene.MAIN, Scene.GAME].includes(game.scene) && <Sidebar />}

          {game.scene === Scene.MAIN && <Main />}
          {game.scene === Scene.LOBBY && <Lobby />}
          {game.scene === Scene.GAME && <Game />}
          {game.scene === Scene.RESULT && <Result />}
        </main>

        <footer className="flex flex-shrink-0">footer</footer>
      </div>

      <Toaster richColors />
      <Debug game={game} />
    </div>
  );
}

export default App;
