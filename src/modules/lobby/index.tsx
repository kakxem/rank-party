import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gameAtom, wsAtom } from "@/hooks/useGame";
import { Messages } from "@/types";
import { useAtomValue } from "jotai";
import { useState } from "react";

export const Lobby = () => {
  const ws = useAtomValue(wsAtom);
  const game = useAtomValue(gameAtom);
  const [showInactive, setShowInactive] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const link = formData.get("link") as string;

    if (ws && name && link) {
      ws.send(
        JSON.stringify({
          type: Messages.ADD_ITEM,
          data: { name: name, link: link },
        }),
      );
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleDeleteItem = (id: string) => {
    if (ws) {
      ws.send(
        JSON.stringify({
          type: Messages.DELETE_ITEM,
          data: { id },
        }),
      );
    }
  };

  return (
    <section className="flex flex-1 justify-between gap-3">
      <aside className="flex max-w-sm flex-1 flex-col gap-3 rounded-xl bg-slate-100 p-5 dark:bg-slate-900">
        <header className="flex justify-between">
          <h2 className="flex items-center text-xl font-bold">Players</h2>

          <Button onClick={() => setShowInactive(!showInactive)}>
            {showInactive ? "Hide inactive" : "Show inactive"}
          </Button>
        </header>

        <ul className="flex flex-col gap-3">
          {game.players.map((player) => {
            if (!showInactive && !player.active) return null;

            return (
              <li
                key={player.id}
                className="flex h-20 items-center gap-3 rounded-md bg-slate-200 p-2 px-3 dark:bg-slate-800"
              >
                <div className="flex rounded-md border-2 p-5 dark:border-slate-700">
                  {player.name.slice(0, 1).toUpperCase()}
                </div>
                <p className="flex flex-1 justify-between">
                  {player.name}
                  <span className="text-end">
                    {player.active ? "🟢" : "🔴"}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex flex-1 flex-col justify-between gap-3 rounded-xl bg-slate-100 p-5 dark:bg-slate-900">
        <section className="h-full w-full p-5">
          <header>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <Input
                name="name"
                className="max-w-xs"
                placeholder="Item name"
                autoComplete="off"
              />
              <Input name="link" placeholder="Item link" autoComplete="off" />
              <Button type="submit">Add</Button>
            </form>
          </header>

          {/* Table */}
          <ol>
            {game.list.map((item) => (
              <li
                key={item.id}
                className="flex h-20 items-center gap-3 rounded-md bg-slate-200 p-2 px-3 dark:bg-slate-800"
              >
                <div className="flex rounded-md border-2 p-5 dark:border-slate-700">
                  {item.name.slice(0, 1).toUpperCase()}
                </div>
                <p className="flex flex-1 justify-between">
                  {item.name}
                  <span className="text-end">{item.link}</span>
                </p>
                <Button onClick={() => handleDeleteItem(item.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </Button>
              </li>
            ))}
          </ol>
        </section>

        <Button>Start</Button>
      </div>
    </section>
  );
};