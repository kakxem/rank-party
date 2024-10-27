import { ChangeWaitingTime } from "@/components/sidebar/settings/components/change-waiting-time";
import { ImportAndExportList } from "@/components/sidebar/settings/components/import-and-export-list";
import { ManageBlacklist } from "@/components/sidebar/settings/components/manage-blacklist";
import { ShowInactivePlayers } from "@/components/sidebar/settings/components/show-inactive-players";

const Section = ({ children }: { children: React.ReactNode }) => {
  return <section className="flex flex-col gap-2">{children}</section>;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-center text-xl font-bold">{children}</h2>;
};

const SectionContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-7">{children}</div>;
};

export const Settings = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-10">
        <Section>
          <SectionTitle>User Settings</SectionTitle>
          <SectionContent>
            <ShowInactivePlayers />
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Game Settings</SectionTitle>
          <SectionContent>
            <ImportAndExportList />
            <ChangeWaitingTime />
            <ManageBlacklist />
          </SectionContent>
        </Section>
      </div>
    </div>
  );
};
