import { gameAtom } from "@/hooks/use-game";
import { Scene } from "@/types";
import { useAtomValue } from "jotai";
import { Helmet } from "react-helmet-async";

export const SharedHelmet = () => {
  const game = useAtomValue(gameAtom);

  const title =
    Scene.MAIN === game.scene ? "Rank Party" : `Rank Party - ${game.name}`;

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};
