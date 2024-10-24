import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { formTypeAtom, useDialog } from "@/hooks/use-dialog";
import { Form } from "@/modules/main/components/form";
import { useAtomValue } from "jotai";

export const Main = () => {
  const { handleOpenCreate, handleOpenJoin } = useDialog();
  const formType = useAtomValue(formTypeAtom);

  const title = formType === "create" ? "Create Room" : "Join Room";
  const description =
    formType === "create"
      ? "Enter your username and create a new room."
      : "Enter your username and the room ID to join an existing room.";

  return (
    <section className="flex flex-1 flex-col justify-center gap-20">
      <div className="flex flex-col items-center justify-center gap-5">
        <Button className="w-72" onClick={handleOpenCreate}>
          Create Room
        </Button>
        <Button className="w-72" onClick={handleOpenJoin}>
          Join Room
        </Button>
        <ResponsiveDialog title={title} description={description}>
          <Form />
        </ResponsiveDialog>
      </div>
    </section>
  );
};
