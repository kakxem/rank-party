import { SettingTemplate } from "@/components/sidebar/settings/components/setting-template";
import { Slider } from "@/components/ui/slider";
import { useCurrentPlayer } from "@/hooks/use-current-player";
import { gameAtom, wsAtom } from "@/hooks/use-game";
import { Messages, Role, Scene, type Settings } from "@/types";
import { useAtomValue } from "jotai";

const TIMEOUT_VALUES = [1, 3, 5, 7, 10];

export const ChangeWaitingTime = () => {
  const game = useAtomValue(gameAtom);
  const ws = useAtomValue(wsAtom);
  const currentPlayer = useCurrentPlayer();

  const isAdmin = currentPlayer?.role === Role.ADMIN;
  const isLobby = game.scene === Scene.LOBBY;
  const showWaitingTime = isAdmin && isLobby;

  const handleTimeoutChange = (value: number) => {
    const settings: Partial<Settings> = { timeout: TIMEOUT_VALUES[value] };

    ws?.send(
      JSON.stringify({
        type: Messages.UPDATE_SETTINGS,
        data: settings,
      }),
    );
  };

  if (!showWaitingTime) return null;

  return (
    <SettingTemplate
      title="Game waiting time"
      description="Adjust the waiting time between items in the game."
    >
      <div className="flex h-full w-full items-center space-x-2">
        <Slider
          defaultValue={[1]}
          max={TIMEOUT_VALUES.length - 1}
          step={1}
          onValueCommit={(value) => {
            handleTimeoutChange(value[0]);
          }}
        />
      </div>
      <div className="mt-1 flex h-full w-full justify-between px-1">
        {TIMEOUT_VALUES.map((value) => (
          <div key={value} className="flex w-3 flex-col items-center">
            <span className="mt-1 text-sm text-muted-foreground">{value}s</span>
          </div>
        ))}
      </div>
    </SettingTemplate>
  );
};
