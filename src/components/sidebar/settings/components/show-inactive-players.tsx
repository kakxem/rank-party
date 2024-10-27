import { showInactivePlayersAtom } from "@/components/sidebar/settings/atoms";
import { SettingTemplate } from "@/components/sidebar/settings/components/setting-template";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAtom } from "jotai";

export const ShowInactivePlayers = () => {
  const [showInactivePlayers, setShowInactivePlayers] = useAtom(
    showInactivePlayersAtom,
  );

  return (
    <SettingTemplate
      title="Player visibility"
      description="Toggle this switch to show or hide inactive players in the player list."
    >
      <div className="flex items-center space-x-2">
        <Switch
          id="show-inactive-switch"
          checked={showInactivePlayers}
          onCheckedChange={setShowInactivePlayers}
        />
        <Label htmlFor="show-inactive-switch" className="cursor-pointer">
          Show inactive players
        </Label>
      </div>
    </SettingTemplate>
  );
};
