import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";

export const Main = () => {
  const { handleOpenCreate, handleOpenJoin } = useDialog();

  return (
    <section className="flex flex-1 flex-col justify-center gap-20">
      <div className="flex flex-col items-center justify-center gap-5">
        <Button className="w-72" onClick={handleOpenCreate}>
          Create Room
        </Button>
        <Button className="w-72" onClick={handleOpenJoin}>
          Join Room
        </Button>
        <ResponsiveDialog />
      </div>
    </section>
  );
};
