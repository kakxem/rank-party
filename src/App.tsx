import { Debug } from "@/components/debug";
import { EditableRoomName } from "@/components/editable-room-name";
import { SharedHelmet } from "@/components/shared-helmet";
import { gameAtom, useGame } from "@/hooks/use-game";
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
      <SharedHelmet />

      <div className="flex h-screen flex-col justify-center pt-5 lg:gap-10 lg:pt-10">
        <header className="flex h-full max-h-[6rem] items-center justify-center">
          <EditableRoomName />
        </header>

        <main className="container flex max-h-[65rem] flex-grow gap-4 overflow-y-auto overflow-x-hidden px-3 pb-3 sm:px-10">
          {game.scene === Scene.MAIN && <Main />}
          {game.scene === Scene.LOBBY && <Lobby />}
          {game.scene === Scene.GAME && <Game />}
          {game.scene === Scene.RESULT && <Result />}
        </main>

        <footer className="absolute bottom-0 left-0 text-background">
          footer
        </footer>
      </div>
      <Toaster richColors />
      {import.meta.env.DEV && <Debug game={game} />}
    </>
  );
}

export default App;
