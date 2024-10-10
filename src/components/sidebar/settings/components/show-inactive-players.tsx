import { showInactivePlayersAtom } from "@/components/sidebar/settings/atoms";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAtom } from "jotai";

export const ShowInactivePlayers = () => {
  const [showInactivePlayers, setShowInactivePlayers] = useAtom(
    showInactivePlayersAtom,
  );

  return (
    <div className="flex flex-col items-start">
      <h3 className="mb-2 text-lg font-semibold">Visibility</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Toggle this switch to show or hide inactive players in the player list.
      </p>
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
    </div>
  );
};
