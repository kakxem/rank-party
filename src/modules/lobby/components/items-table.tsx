import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { gameAtom, wsAtom } from "@/hooks/useGame";
import { YOUTUBE_REGEX } from "@/lib/regex";
import type { Item } from "@/types";
import { Messages } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useAtomValue } from "jotai";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { useState } from "react";

export const ItemsTable = () => {
  const ws = useAtomValue(wsAtom);
  const game = useAtomValue(gameAtom);
  const [name, setName] = useState("");

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const link = formData.get("link") as string;

    if (ws && name && link) {
      ws.send(
        JSON.stringify({
          type: Messages.ADD_ITEM,
          data: { name, link },
        }),
      );
      (e.target as HTMLFormElement).reset();
      setName("");
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

  const getYoutubeName = async (link: string) => {
    if (!YOUTUBE_REGEX.test(link)) return;
    const id = link.match(YOUTUBE_REGEX)?.[1];

    const url = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.title) {
      setName(data.title);
    }
  };

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const link = row.original.link;

        return (
          <div className="max-w-lg truncate">
            <a
              className="truncate underline"
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              {name}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created By
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdBy = row.getValue("createdBy") as string;
        const player = game.players.find((item) => item.id === createdBy);
        return <div className="max-w-md truncate">{player?.name ?? "-"}</div>;
      },
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => handleDeleteItem(id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <section className="flex flex-1 flex-col overflow-y-hidden p-5">
      <header className="flex flex-col gap-3">
        <form className="flex gap-2" onSubmit={handleAddItem}>
          <Input
            type="url"
            name="link"
            placeholder="Item link"
            autoComplete="off"
            aria-autocomplete="none"
            required
            onChange={(e) => {
              getYoutubeName(e.target.value);
            }}
          />
          <Input
            type="text"
            name="name"
            className="max-w-xs"
            placeholder="Item name"
            autoComplete="off"
            aria-autocomplete="none"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Button type="submit">Add</Button>
        </form>
      </header>

      {/* Table */}
      <div className="mt-5 h-full overflow-x-auto rounded-lg border">
        <DataTable columns={columns} data={game.list} />
      </div>
    </section>
  );
};
