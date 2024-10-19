import { Slider } from "@/components/ui/slider";
import { wsAtom } from "@/hooks/useGame";
import { Messages, type Settings } from "@/types";
import { useAtomValue } from "jotai";

export const ChangeWaitingTime = () => {
  const ws = useAtomValue(wsAtom);
  const secondsValues = ["1s", "3s", "5s", "7s", "10s"];

  const handleTimeoutChange = (value: number) => {
    const settings: Partial<Settings> = { timeout: value };
    ws?.send(
      JSON.stringify({
        type: Messages.UPDATE_SETTINGS,
        data: settings,
      }),
    );
  };

  return (
    <div className="flex flex-col items-start">
      <h3 className="mb-2 text-lg font-semibold">Change Waiting Time</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Adjust the waiting time between items in the game.
      </p>
      <div className="flex h-full w-full items-center space-x-2">
        <Slider
          defaultValue={[1]}
          max={4}
          step={1}
          onValueChange={(value) => {
            handleTimeoutChange(value[0]);
          }}
        />
      </div>
      <div className="mt-1 flex h-full w-full justify-between px-1">
        {secondsValues.map((value) => (
          <div key={value} className="flex w-3 flex-col items-center">
            <span className="mt-1 text-sm text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
