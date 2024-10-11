import { ExportButton } from "@/components/export-button";
import { ImportButton } from "@/components/import-button";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { Role } from "@/types";

export const ImportAndExportList = () => {
  const currentPlayer = useCurrentPlayer();
  const isAdmin = currentPlayer?.role === Role.ADMIN;

  const getDescription = () => {
    if (isAdmin) {
      return "You can import and export the table list.";
    } else {
      return "You can export the table list.";
    }
  };

  return (
    <div className="flex flex-col items-start">
      <h3 className="mb-2 text-lg font-semibold">Data management</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {getDescription()}
      </p>
      <div className="flex w-full items-center gap-2">
        {isAdmin && <ImportButton />}
        <ExportButton />
      </div>
    </div>
  );
};
