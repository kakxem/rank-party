import { Button } from "@/components/ui/button";
import { Form } from "@/modules/main/components/form";
import { useFormDialog } from "./hooks/use-form-dialog";

export const Main = () => {
  const { handleOpenCreate, handleOpenJoin } = useFormDialog();

  return (
    <section className="flex flex-1 flex-col justify-center gap-20">
      <div className="flex flex-col items-center justify-center gap-5">
        <Button className="w-72" onClick={handleOpenCreate}>
          Create Room
        </Button>
        <Button className="w-72" onClick={handleOpenJoin}>
          Join Room
        </Button>

        <Form />
      </div>
    </section>
  );
};
