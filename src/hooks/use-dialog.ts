import { atom, useSetAtom } from "jotai";
import { useEffect } from "react";
export const openAtom = atom<boolean>(false);
export const formTypeAtom = atom<"create" | "join">("create");
export const dialogInfoAtom = atom<{
  playerName: string;
  roomCode: string;
}>({ playerName: "", roomCode: "" });

export const useDialog = () => {
  const setOpen = useSetAtom(openAtom);
  const setFormType = useSetAtom(formTypeAtom);
  const setDialogInfo = useSetAtom(dialogInfoAtom);

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.pathname.split("/").pop();

    if (id) {
      setDialogInfo((prev) => ({ ...prev, roomCode: id }));
      setFormType("join");
      setOpen(true);
    }
  }, [setDialogInfo, setFormType, setOpen]);

  const handleOpenCreate = () => {
    setFormType("create");
    setOpen(true);
  };

  const handleOpenJoin = () => {
    setFormType("join");
    setOpen(true);
  };

  return { handleOpenCreate, handleOpenJoin };
};
