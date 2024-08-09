import { gameAtom } from "@/App";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";

export const Main = () => {
  const [game, setGame] = useAtom(gameAtom);

  return (
    <Input
      placeholder="Name"
      onChange={(e) => setGame({ ...game, name: e.target.value })}
    />
  );
};
