import { Card, CardContent } from "@/components/ui/card";
import Welcome from "./_components/widgets/welcome";
import DailyPnlWidget from "./_components/widgets/daily-pnl";
import Performance from "./_components/widgets/performance";
import Portfolio from "./_components/widgets/portfolio";
import NewsEvent from "./_components/widgets/news-event";
import GoalMeter from "./_components/widgets/goal-meter";

import EquityWidget from "./_components/widgets/equity-widget";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { WorldClockWidget } from "./_components/widgets/world-clock";
import { Heatmap } from "./_components/widgets/heat-map";

const demoData = [
  {
    id: 1,
    title: "Slide 1",
    tagline: "Tagline 1",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Slide 2",
    tagline: "Tagline 2",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "Slide 3",
    tagline: "Tagline 3",
    image: "https://via.placeholder.com/150",
  },
];

const pnlData = [
  { date: "Mon", pnl: 1250, isWeekend: false },
  { date: "Tue", pnl: -320, isWeekend: false },
  { date: "Wed", pnl: 780, isWeekend: false },
  { date: "Thurs", pnl: -150, isWeekend: false },
  { date: "Fri", pnl: 0, isWeekend: true },
  { date: "Sat", pnl: 660, isWeekend: true },
  { date: "Sun", pnl: 920, isWeekend: false },
];

export default function Page() {
  return (
    <>
      <div className="p-4  md:p-6 gap-y-4 md:gap-4 grid-cols-1 grid lg:grid-cols-4 lg:gap-6 border border-red-800">
        <Welcome />

        <Performance />
        {/*
        <Portfolio />

        <Card className="bg-slate-600 ">
          <CardContent className="flex h-full items-center justify-center">
            Economic Events(JUNE 5TH)
          </CardContent>
        </Card> */}
        {/* <DailyPnlWidget pnlData={pnlData} /> */}
        {/* <NewsEvent />

        <div className="col-span-2 h-fit grid md:grid-cols-2 md:gap-6">
          <GoalMeter />

          <WorldClockWidget />
          <div className="col-span-2 h-full">
            <Card className=" border-dashed border-2">
              <CardContent className="flex border-dashed h-full items-center justify-center">
                sad
              </CardContent>
            </Card>
          </div>
        </div>

        <EquityWidget />
        <Collapsible className="col-span-full border  shadow-sm shadow-black ">
          <CollapsibleTrigger className="text-xs  hover:cursor-pointer hover:bg-muted/20  py-6 w-full items-start flex uppercase text-muted-foreground tracking-wider font-mono px-4 md:px-6">
            heat map
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Heatmap />
          </CollapsibleContent>
        </Collapsible> */}
      </div>
    </>
  );
}
