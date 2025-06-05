import { Card, CardContent } from "@/components/ui/card";
import { EquityChart } from "../charts/equity-chart";
import { Chart01 } from "@/components/charts/chart-1";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "@/components/ui/collapsible";

export default function EquityWidget() {
  return (
    <>
      <Collapsible className="col-span-full border   shadow-sm shadow-black ">
        <CollapsibleTrigger className="text-xs  hover:cursor-pointer hover:bg-muted/20  py-6 w-full items-start flex uppercase tracking-wider font-mono px-4 md:px-6">
          Equity Charts ({tradingAccounts.length} accounts)
        </CollapsibleTrigger>
        <CollapsibleContent className="p-1">
          <Card className="border-transparent shadow-none">
            <CardContent>
              <div className="overflow-hidden">
                <div className="grid auto-rows-min md:grid-cols-2 gap-1 ">
                  {tradingAccounts.map((account) => (
                    <EquityChart key={account.id} account={account} />
                  ))}
                  <Chart01 />
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}

const tradingAccounts = [
  {
    id: "12",
    name: "Funded Next",
    chartConfig: {
      actual: {
        label: "Actual",
        color: "var(--chart-6)",
      },
      projected: {
        label: "Projected",
        color: "var(--chart-4)",
      },
    },
  },
  {
    id: "123",
    name: "Goat Funded",
    chartConfig: {
      actual: {
        label: "Actual",
        color: "var(--chart-2)",
      },
      projected: {
        label: "Projected",
        color: "var(--chart-3)",
      },
    },
  },
  {
    id: "1234",
    name: "Alpha capitals",
    chartConfig: {
      actual: {
        label: "Actual",
        color: "var(--chart-5)",
      },
      projected: {
        label: "Projected",
        color: "var(--chart-3)",
      },
    },
  },
  {
    id: "1235",
    name: "FTMO",
    chartConfig: {
      actual: {
        label: "Actual",
        color: "var(--chart-1)",
      },
      projected: {
        label: "Projected",
        color: "var(--chart-3)",
      },
    },
  },
];
