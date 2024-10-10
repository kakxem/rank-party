import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-0 top-1/2 h-16 w-5 -translate-y-1/2 rounded-l-none lg:hidden"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[70%] p-0 pt-5 sm:w-[385px]">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
