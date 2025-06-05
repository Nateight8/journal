import { Card, CardContent } from "@/components/ui/card";

export default function GoalMeter() {
  return (
    <>
      <Card className=" ">
        <CardContent className="flex ">
          <div className="relative w-full h-fit pb-8">
            <div className="mb-6">
              <h2 className="text-xs uppercase text-muted-foreground tracking-wider font-mono">
                Monthly Target
              </h2>
            </div>
            <div className=" w-full">
              <h3 className="text-7xl font-bold">5.01%</h3>
            </div>
            <div className="relative mt-4">
              <div className="w-full h-1 bg-zinc-800 shadow-inner shadow-black">
                <div
                  className="h-full bg-zinc-400"
                  style={{ width: "28%" }}
                ></div>
              </div>
              <div className="absolute -bottom-10 right-6  flex items-center">
                <span>/</span> $18.00
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
