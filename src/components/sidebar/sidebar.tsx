import { Players } from "@/components/sidebar/players";
import { Settings } from "@/components/sidebar/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Users as UsersIcon } from "lucide-react";

export const Sidebar = () => {
  return (
    <aside className="hidden max-w-sm flex-1 flex-col gap-3 rounded-xl bg-slate-100 p-5 sm:flex dark:bg-slate-900">
      <Tabs defaultValue="players" className="flex h-full flex-col">
        <TabsList className="flex w-full">
          <TabsTrigger value="players" className="flex-1">
            <UsersIcon className="mr-2" />
            Players
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <SettingsIcon className="mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="players" className="flex-1">
          <Players />
        </TabsContent>
        <TabsContent value="settings" className="flex-1">
          <Settings />
        </TabsContent>
      </Tabs>
    </aside>
  );
};
