import { Debug } from "@/components/debug";
import { Game as GameScene } from "@/components/scenes/game";
import { Lobby } from "@/components/scenes/lobby";
import { Main } from "@/components/scenes/main";
import { Result } from "@/components/scenes/result";
import { gameAtom, useGame } from "@/hooks/useGame";
import { Scene } from "@/types";
import { useAtomValue } from "jotai";
import EditableRoomName from "./components/editable-room-name";

function App() {
  useGame();
  const game = useAtomValue(gameAtom);

  return (
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
        {game.scene === Scene.GAME && <GameScene />}
        {game.scene === Scene.RESULT && <Result />}
      </main>

      <footer className="p-5">footer</footer>

      <Debug game={game} />
    </div>
  );
}

export default App;
