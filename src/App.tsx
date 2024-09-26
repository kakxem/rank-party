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
    <>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-center px-10 pt-5">
          <EditableRoomName />
        </header>

        <main className="container flex h-full flex-1 gap-4 px-10 py-3">
          {![Scene.MAIN, Scene.GAME].includes(game.scene) && <Sidebar />}

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
