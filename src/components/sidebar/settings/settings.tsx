import { ChangeWaitingTime } from "@/components/sidebar/settings/components/change-waiting-time";
import { ImportAndExportList } from "@/components/sidebar/settings/components/import-and-export-list";
import { ShowInactivePlayers } from "@/components/sidebar/settings/components/show-inactive-players";
import { gameAtom } from "@/hooks/use-game";
import { Scene } from "@/types";
import { useAtomValue } from "jotai";

const Section = ({ children }: { children: React.ReactNode }) => {
  return <section className="flex flex-col gap-4">{children}</section>;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-center text-xl font-medium">{children}</h2>;
};

export const Settings = () => {
  const game = useAtomValue(gameAtom);
  return (
    <div className="p-4">
      <div className="flex flex-col gap-10">
        <Section>
          <SectionTitle>Player</SectionTitle>
          <ShowInactivePlayers />
        </Section>

        <Section>
          <SectionTitle>Game Settings</SectionTitle>
          <ImportAndExportList />
          {game.scene !== Scene.RESULT && <ChangeWaitingTime />}
        </Section>
      </div>
    </div>
  );
};
