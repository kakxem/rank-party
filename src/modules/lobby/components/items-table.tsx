import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { gameAtom, wsAtom } from "@/hooks/useGame";
import type { Item } from "@/types";
import { Messages } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useAtomValue } from "jotai";
import { ArrowUpDown, Trash2 } from "lucide-react";

export const ItemsTable = () => {
  const ws = useAtomValue(wsAtom);
  const game = useAtomValue(gameAtom);

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
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
        return <div className="max-w-md truncate">{name}</div>;
      },
    },
    {
      accessorKey: "link",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Link
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const link = row.getValue("link") as string;
        return (
          <div className="max-w-xs truncate">
            <a
              className="truncate underline"
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              {link}
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
    <section className="h-full w-full p-5">
      <header>
        <form className="flex gap-2" onSubmit={handleAddItem}>
          <Input
            type="text"
            name="name"
            className="max-w-xs"
            placeholder="Item name"
            autoComplete="off"
            aria-autocomplete="none"
          />
          <Input
            type="url"
            name="link"
            placeholder="Item link"
            autoComplete="off"
            aria-autocomplete="none"
          />
          <Button type="submit">Add</Button>
        </form>
      </header>

      {/* Table */}
      <div className="py-5">
        <DataTable columns={columns} data={game.list} />
      </div>
    </section>
  );
};
