import { Button } from "@/components/ui/button";

export const Game = () => {
  return (
    <section className="flex flex-1 flex-col justify-around gap-10 rounded-xl border">
      <section className="flex flex-col items-center justify-center">
        <h2 className="text-5xl font-bold">Video name</h2>
        <div className="flex aspect-video w-full max-w-5xl bg-slate-300 shadow-2xl transition-transform">
          Video
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-5 px-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <Button
            key={index + 1}
            className="h-24 w-24 border text-3xl shadow-md transition-transform hover:scale-110"
            variant="ghost"
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </section>
  );
};
