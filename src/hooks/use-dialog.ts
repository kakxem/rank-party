import { atom, useSetAtom } from "jotai";
export const openAtom = atom<boolean>(false);
export const formTypeAtom = atom<"create" | "join">("create");
export const dialogInfoAtom = atom<{
  playerName: string;
  roomCode: string;
}>({ playerName: "", roomCode: "" });

export const useDialog = () => {
  const setOpen = useSetAtom(openAtom);
  const setFormType = useSetAtom(formTypeAtom);

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
