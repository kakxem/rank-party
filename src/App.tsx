import { Debug } from "@/components/debug";
import { Game as GameScene } from "@/components/scenes/game";
import { Lobby } from "@/components/scenes/lobby";
import { Main } from "@/components/scenes/main";
import { Result } from "@/components/scenes/result";
import { gameAtom, useGame } from "@/hooks/useGame";
import { Scene } from "@/types";
import { useAtomValue } from "jotai";

function App() {
  useGame();
  const game = useAtomValue(gameAtom);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-center p-5">
        <h1 className="text-3xl font-bold underline">Party rank list!</h1>
      </header>

      <main className="flex h-full flex-1 p-10">
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
