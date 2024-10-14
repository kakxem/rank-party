import { ResultsSummary } from "@/modules/result/components/results-summary";
import { ResultsTable } from "@/modules/result/components/results-table";

export const Result = () => {
  return (
    <section className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full snap-y snap-mandatory flex-col overflow-y-auto no-scrollbar">
        <div className="h-full w-full flex-shrink-0 snap-start overflow-hidden">
          <ResultsSummary />
        </div>
        <div className="h-full w-full flex-shrink-0 snap-start overflow-hidden">
          <div className="container flex h-full flex-col">
            <header className="mb-4 flex w-full items-center justify-between">
              <h1 className="text-4xl font-bold text-indigo-800">
                Game Results
              </h1>
            </header>
            <div className="flex-grow overflow-hidden">
              <ResultsTable />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
