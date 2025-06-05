"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClockProps {
  timezone: string;
  city: string;
  size?: number;
}

function AnalogClock({ timezone, city, size = 120 }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeInTimezone = () => {
    return new Date(time.toLocaleString("en-US", { timeZone: timezone }));
  };

  const timeInZone = getTimeInTimezone();
  const hours = timeInZone.getHours() % 12;
  const minutes = timeInZone.getMinutes();
  const seconds = timeInZone.getSeconds();

  const hourAngle = hours * 30 + minutes * 0.5 - 90;
  const minuteAngle = minutes * 6 - 90;
  const secondAngle = seconds * 6 - 90;

  const hourHandLength = size * 0.25;
  const minuteHandLength = size * 0.35;
  const secondHandLength = size * 0.4;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute inset-0">
          {/* Clock face */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            fill="var(--card)"
            stroke="var(--border)"
            strokeWidth="2"
          />

          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30 - 90;
            const x1 =
              size / 2 + Math.cos((angle * Math.PI) / 180) * (size / 2 - 15);
            const y1 =
              size / 2 + Math.sin((angle * Math.PI) / 180) * (size / 2 - 15);
            const x2 =
              size / 2 + Math.cos((angle * Math.PI) / 180) * (size / 2 - 8);
            const y2 =
              size / 2 + Math.sin((angle * Math.PI) / 180) * (size / 2 - 8);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--muted-foreground)"
                strokeWidth="2"
              />
            );
          })}

          {/* Hour hand */}
          <line
            x1={size / 2}
            y1={size / 2}
            x2={
              size / 2 + Math.cos((hourAngle * Math.PI) / 180) * hourHandLength
            }
            y2={
              size / 2 + Math.sin((hourAngle * Math.PI) / 180) * hourHandLength
            }
            stroke="var(--foreground)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Minute hand */}
          <line
            x1={size / 2}
            y1={size / 2}
            x2={
              size / 2 +
              Math.cos((minuteAngle * Math.PI) / 180) * minuteHandLength
            }
            y2={
              size / 2 +
              Math.sin((minuteAngle * Math.PI) / 180) * minuteHandLength
            }
            stroke="var(--foreground)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Second hand */}
          <line
            x1={size / 2}
            y1={size / 2}
            x2={
              size / 2 +
              Math.cos((secondAngle * Math.PI) / 180) * secondHandLength
            }
            y2={
              size / 2 +
              Math.sin((secondAngle * Math.PI) / 180) * secondHandLength
            }
            stroke="var(--primary)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle cx={size / 2} cy={size / 2} r="4" fill="var(--primary)" />
        </svg>
      </div>

      <div className="text-center">
        <div className="font-semibold text-sm">{city}</div>
        <div className="text-xs text-muted-foreground">
          {timeInZone.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>
    </div>
  );
}

export function WorldClockWidget() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Times</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          <AnalogClock timezone="America/New_York" city="New York" />
          <AnalogClock timezone="Europe/London" city="London" />
          <AnalogClock timezone="Asia/Tokyo" city="Tokyo" />
        </div>
      </CardContent>
    </Card>
  );
}
