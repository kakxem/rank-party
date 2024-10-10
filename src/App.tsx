import { Debug } from "@/components/debug";
import { EditableRoomName } from "@/components/editable-room-name";
import { MobileSidebar } from "@/components/sidebar/mobile-sidebar";
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
    <div className="flex h-screen flex-col justify-center pt-5 sm:gap-10 lg:pt-0">
      <header className="flex h-full max-h-[6rem] items-center justify-center">
        <EditableRoomName />
      </header>

      <main className="container flex max-h-[65rem] flex-grow gap-4 overflow-y-auto overflow-x-hidden px-3 pb-3 sm:px-10">
        {![Scene.MAIN, Scene.GAME].includes(game.scene) && (
          <>
            <div className="hidden lg:block lg:max-w-xs lg:flex-1">
              <Sidebar />
            </div>

            <MobileSidebar />
          </>
        )}

        {game.scene === Scene.MAIN && <Main />}
        {game.scene === Scene.LOBBY && <Lobby />}
        {game.scene === Scene.GAME && <Game />}
        {game.scene === Scene.RESULT && <Result />}
      </main>

      <footer className="flex flex-shrink-0">footer</footer>

      <Toaster richColors />
      <Debug game={game} />
    </div>
  );
}

export default App;
