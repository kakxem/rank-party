import { ExportButton } from "@/components/export-button";
import { ImportButton } from "@/components/import-button";

export const ImportAndExportList = () => {
  return (
    <div className="flex flex-col items-start">
      <h3 className="mb-2 text-lg font-semibold">Data management</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Import and export your table list.
      </p>
      <div className="flex w-full items-center gap-2">
        <ImportButton />
        <ExportButton />
      </div>
    </div>
  );
};
