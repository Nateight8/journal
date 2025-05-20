import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Close, Executed, ModifyLof } from "./log-forms";
import { AccountSelection } from "./accounts";

export default function LogTrades() {
  // const form = useForm<z.infer<typeof executeTradeSchema>>({

  // console.log("SELECTED TRADE", trade);

  return (
    <div className="w-full mx-auto">
      <Tabs defaultValue="log" className="items-center">
        {/* <TabsContent value="log" className="w-full p-2">
          <h2 className="text-lg  text-center font-semibold">Log Trade</h2>
        </TabsContent> */}
        {/* <TabsContent value="edit" className="w-full p-2"></TabsContent>
        <TabsContent value="update" className="w-full p-2"></TabsContent>
        <TabsContent value="close" className="w-full p-2"></TabsContent> */}
        <TabsList className="bg-transparent space-x-4">
          {tabList.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className="w-full text-center border-b-2 border-b-transparent hover:border-b-primary focus:outline-none focus:ring-0 hover:cursor-pointer focus:border-b-primary data-[state=active]:border-b-primary data-[state=active]:text-primary"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="log" className="w-full p-2 ">
          <AccountSelection />
        </TabsContent>
        <TabsContent value="edit" className="w-full p-2 ">
          <ModifyLof />
        </TabsContent>
        <TabsContent value="update" className="w-full p-2 ">
          <Executed />
        </TabsContent>
        <TabsContent value="close" className="w-full p-2 ">
          <Close />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const tabList = [
  {
    value: "log",
    label: "Log",
    disabled: false,
  },
  {
    value: "edit",
    label: "Modify",
    disabled: true,
  },
  {
    value: "update",
    label: "Update",
    disabled: false,
  },
  {
    value: "close",
    label: "Close",
    disabled: false,
  },
];
