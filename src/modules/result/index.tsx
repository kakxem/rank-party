import { ResultsTable } from "@/modules/result/components/results-table";

export const Result = () => {
  return (
    <section className="flex flex-1 flex-col justify-between gap-3 rounded-xl">
      <ResultsTable />
    </section>
  );
};
