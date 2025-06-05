import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewsEvent() {
  return (
    <Card className="border-none shadow-none col-span-2 ">
      <CardHeader className="md:px-4 pt-4 pb-2">
        <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
        <p className="text-sm text-muted-foreground">Monday, June 3</p>
      </CardHeader>
      <CardContent className="md:px-0">
        <div className="space-y-2 px-2">
          {[
            { time: "12:50", currency: "EUR", event: "Core CPI (YoY)" },
            { time: "13:30", currency: "GBP", event: "Retail Sales (MoM)" },
            {
              time: "14:15",
              currency: "USD",
              event: "FOMC Member Williams Speaks",
            },
            { time: "15:00", currency: "CAD", event: "Employment Change" },
            { time: "16:30", currency: "USD", event: "Crude Oil Inventories" },
          ].map((event, index) => (
            <div
              key={`${event.currency}-${index}`}
              className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="w-16 flex-shrink-0">
                <span className="text-sm font-medium">{event.time}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.event}</p>
              </div>
              <div className="ml-2">
                <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                  {event.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 mt-2 text-center">
          <button className="text-sm text-primary hover:underline">
            View all events
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
