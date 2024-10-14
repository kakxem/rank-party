import { Sidebar } from "@/components/sidebar/sidebar";
import { ResultsSummary } from "@/modules/result/components/results-summary";
import { ResultsTable } from "@/modules/result/components/results-table";

export const Result = () => {
  return (
    <section className="flex h-full w-full flex-1 snap-y snap-mandatory flex-col overflow-hidden overflow-y-auto no-scrollbar">
      <div className="h-full w-full flex-shrink-0 snap-start overflow-hidden">
        <ResultsSummary />
      </div>

      <div className="flex h-full w-full flex-shrink-0 snap-start overflow-hidden">
        <Sidebar />
        <ResultsTable />
      </div>
    </section>
  );
};
