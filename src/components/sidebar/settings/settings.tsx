import { ShowInactivePlayers } from "@/components/sidebar/settings/components/show-inactive-players";

export const Settings = () => {
  return (
    <div className="flex flex-col items-start gap-7 p-4">
      <ShowInactivePlayers />
    </div>
  );
};
