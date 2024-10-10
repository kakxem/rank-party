import { ImportAndExportList } from "@/components/sidebar/settings/components/import-and-export-list";
import { ShowInactivePlayers } from "@/components/sidebar/settings/components/show-inactive-players";

const Section = ({ children }: { children: React.ReactNode }) => {
  return <section className="flex flex-col gap-4">{children}</section>;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-center text-xl font-medium">{children}</h2>;
};

export const Settings = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-10">
        <Section>
          <SectionTitle>Player</SectionTitle>
          <ShowInactivePlayers />
        </Section>

        <Section>
          <SectionTitle>Table</SectionTitle>
          <ImportAndExportList />
        </Section>
      </div>
    </div>
  );
};
