import { atom, useSetAtom } from "jotai";
import { useEffect } from "react";

export enum FormType {
  CREATE,
  JOIN,
}

export const openFormAtom = atom<boolean>(false);
export const formTypeAtom = atom<FormType>(FormType.CREATE);
export const dialogInfoAtom = atom<{
  playerName: string;
  roomCode: string;
}>({ playerName: "", roomCode: "" });

export const useFormDialog = () => {
  const setOpen = useSetAtom(openFormAtom);
  const setFormType = useSetAtom(formTypeAtom);
  const setDialogInfo = useSetAtom(dialogInfoAtom);

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.pathname.split("/").pop();

    if (id) {
      setDialogInfo((prev) => ({ ...prev, roomCode: id }));
      setFormType(FormType.JOIN);
      setOpen(true);
    }
  }, [setDialogInfo, setFormType, setOpen]);

  const handleOpenCreate = () => {
    setFormType(FormType.CREATE);
    setOpen(true);
  };

  const handleOpenJoin = () => {
    setFormType(FormType.JOIN);
    setOpen(true);
  };

  return { handleOpenCreate, handleOpenJoin };
};
