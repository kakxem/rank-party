import { Button } from "@/components/ui/button";
import { wsAtom } from "@/hooks/useGame";
import { Messages } from "@/types";
import { useAtomValue } from "jotai";
import { FileDown } from "lucide-react";
export const ImportButton = () => {
  const ws = useAtomValue(wsAtom);
  const handleImportList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Show file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        if (!reader.result) return;
        const data = JSON.parse(reader.result as string);
        if (!data) return;
        if (ws) {
          ws.send(
            JSON.stringify({
              type: Messages.IMPORT_LIST,
              data: { list: data },
            }),
          );
        }
      };
    };
  };

  return (
    <Button variant="outline" onClick={handleImportList}>
      <FileDown className="mr-1 h-4 w-4" /> Import
    </Button>
  );
};
