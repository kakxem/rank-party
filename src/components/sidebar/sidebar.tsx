import { Players } from "@/components/sidebar/players";
import { Settings } from "@/components/sidebar/settings/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Users as UsersIcon } from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-3 p-5">
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
        <TabsContent value="players" className="flex-1 overflow-y-auto">
          <Players />
        </TabsContent>
        <TabsContent value="settings" className="flex-1 overflow-y-auto">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
