import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function NewsEvent() {
  return (
    <Card className="border-none shadow-none col-span-2 ">
      <CardHeader className="md:px-0">
        <CardTitle>Upcoming Events(June 3)</CardTitle>
      </CardHeader>
      <CardContent className="md:px-0">
        <Carousel className="w-full border-x-2 border-dashed">
          <CarouselContent className="-ml-1">
            {forexFactoryNewsMock.map((news, index) => (
              <CarouselItem
                key={`${news.country}-${index}`}
                className="pl-1 basis-1/2 sm:basis-1/3 lg:basis-1/2"
              >
                <div className="p-1 h-full hover:cursor-pointer">
                  <Card className="h-full gap-2 relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 hover:bg-muted/10 transition-colors">
                    <div
                      className={`absolute right-0 top-0 border w-14 h-4 ${
                        news.impact === "High" ? "bg-destructive" : "bg-muted"
                      }`}
                    />
                    <CardHeader className="mb-0">
                      <CardTitle className="text-md mb-0">
                        {news.event}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className=" flex items-start h-full">
                      <p className="text-muted-foreground text-sm">
                        {news.description}
                      </p>
                    </CardContent>
                    <CardFooter className="">hello world</CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}

const forexFactoryNewsMock = [
  {
    country: "United States",
    currency: "USD",
    event: "Non-Farm Employment Change",
    time: "2025-06-03T12:30:00Z",
    actual: 285000,
    forecast: 250000,
    previous: 275000,
    impact: "High",
    description:
      "Measures the change in the number of employed people during the previous month, excluding the farming industry. High employment is bullish for the USD.",
  },
  {
    country: "Eurozone",
    currency: "EUR",
    event: "ECB Interest Rate Decision",
    time: "2025-06-03T11:45:00Z",
    actual: "4.50%",
    forecast: "4.50%",
    previous: "4.25%",
    impact: "High",
    description:
      "The ECB’s rate decision impacts the value of the euro. A higher rate tends to be bullish for the currency.",
  },
  {
    country: "United Kingdom",
    currency: "GBP",
    event: "CPI y/y",
    time: "2025-06-02T07:00:00Z",
    actual: "3.2%",
    forecast: "3.1%",
    previous: "3.0%",
    impact: "Medium",
    description:
      "Consumer Price Index measures the change in the price of goods and services. It's the main indicator of inflation.",
  },
  {
    country: "Australia",
    currency: "AUD",
    event: "Retail Sales m/m",
    time: "2025-06-01T01:30:00Z",
    actual: "0.5%",
    forecast: "0.4%",
    previous: "0.3%",
    impact: "Medium",
    description:
      "Monthly change in the total value of retail sales. Indicates consumer spending strength.",
  },
  {
    country: "Japan",
    currency: "JPY",
    event: "BOJ Press Conference",
    time: "2025-06-03T06:00:00Z",
    actual: null,
    forecast: null,
    previous: null,
    impact: "High",
    description:
      "BOJ officials comment on future monetary policy. High volatility is expected during the press conference.",
  },
];
