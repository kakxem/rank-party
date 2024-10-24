import { ExportButton } from "@/components/export-button";
import { ImportButton } from "@/components/import-button";
import { useCurrentPlayer } from "@/hooks/use-current-player";
import { gameAtom } from "@/hooks/useGame";
import { Role, Scene } from "@/types";
import { useAtomValue } from "jotai";

export const ImportAndExportList = () => {
  const { scene } = useAtomValue(gameAtom);
  const currentPlayer = useCurrentPlayer();

  const isAdmin = currentPlayer?.role === Role.ADMIN;
  const isResultScene = scene === Scene.RESULT;
  const showImport = isAdmin && !isResultScene;

  return (
    <div className="flex flex-col items-start">
      <h3 className="mb-2 text-lg font-semibold">Data management</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {showImport
          ? "You can import and export the table list."
          : "You can export the table list."}
      </p>
      <div className="flex w-full items-center gap-2">
        {showImport && <ImportButton />}
        <ExportButton />
      </div>
    </div>
  );
};
