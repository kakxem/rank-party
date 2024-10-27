import { ExportButton } from "@/components/export-button";
import { ImportButton } from "@/components/import-button";
import { SettingTemplate } from "@/components/sidebar/settings/components/setting-template";
import { useCurrentPlayer } from "@/hooks/use-current-player";
import { gameAtom } from "@/hooks/use-game";
import { Role, Scene } from "@/types";
import { useAtomValue } from "jotai";

export const ImportAndExportList = () => {
  const { scene } = useAtomValue(gameAtom);
  const currentPlayer = useCurrentPlayer();

  const isAdmin = currentPlayer?.role === Role.ADMIN;
  const isResultScene = scene === Scene.RESULT;
  const showImport = isAdmin && !isResultScene;

  return (
    <SettingTemplate
      title="Data management"
      description={
        showImport
          ? "You can import and export the table list."
          : "You can export the table list."
      }
    >
      <div className="flex w-full items-center gap-2">
        {showImport && <ImportButton />}
        <ExportButton />
      </div>
    </SettingTemplate>
  );
};
