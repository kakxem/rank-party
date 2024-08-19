import { Button } from "@/components/ui/button";
import { ItemsTable } from "@/modules/lobby/components/items-table";

export const Lobby = () => {
  return (
    <section className="flex flex-1 flex-col justify-between gap-3 rounded-xl bg-slate-100 p-5 dark:bg-slate-900">
      <ItemsTable />
      <Button>Start</Button>
    </section>
  );
};
