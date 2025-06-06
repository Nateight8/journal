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

function useMarketSessions() {
  type SessionKey = "Tokyo" | "London" | "New York" | "Market Closed";

  interface SessionInfo {
    current: SessionKey;
    currentDescription: string;
    currentCloses: string;
    next: Exclude<SessionKey, "Market Closed">;
    nextDescription: string;
    nextOpens: string;
  }

  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    current: "Market Closed",
    currentDescription: "",
    currentCloses: "",
    next: "Tokyo",
    nextDescription: "",
    nextOpens: "",
  });

  useEffect(() => {
    const updateSessions = () => {
      const now = new Date();

      // Get current times in each timezone
      const nyTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      );
      const londonTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/London" })
      );
      const tokyoTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
      );

      const nyHour = nyTime.getHours();
      const londonHour = londonTime.getHours();
      const tokyoHour = tokyoTime.getHours();

      // Session characteristics
      const sessionData = {
        Tokyo: {
          description: "Lower volatility, range trading",
          opens: "9:00 AM JST",
          closes: "5:00 PM JST",
        },
        London: {
          description: "Moderate volatility, news-driven",
          opens: "8:00 AM GMT",
          closes: "4:30 PM GMT",
        },
        "New York": {
          description: "Highest volume and volatility",
          opens: "9:30 AM EST",
          closes: "4:00 PM EST",
        },
      } as const;

      // type SessionData = typeof sessionData;
      // type SessionName = keyof SessionData;
      let currentSession: SessionKey = "Market Closed";
      let nextSession: Exclude<SessionKey, "Market Closed"> = "Tokyo";

      // Check Tokyo session (9:00 - 17:00 JST)
      const tokyoOpen = tokyoHour >= 9 && tokyoHour < 17;

      // Check London session (8:00 - 16:30 GMT)
      const londonOpen =
        londonHour >= 8 &&
        (londonHour < 16 ||
          (londonHour === 16 && londonTime.getMinutes() < 30));

      // Check New York session (9:30 - 16:00 EST)
      const nyOpen =
        nyHour >= 9 &&
        (nyHour < 16 || (nyHour === 9 && nyTime.getMinutes() >= 30));

      // Determine current session (priority order: NY > London > Tokyo)
      if (nyOpen) {
        currentSession = "New York";
      } else if (londonOpen) {
        currentSession = "London";
      } else if (tokyoOpen) {
        currentSession = "Tokyo";
      } else {
        currentSession = "Market Closed";
      }

      // Determine next session
      if (currentSession === "Market Closed") {
        // Find next opening session
        if (tokyoHour < 9) {
          nextSession = "Tokyo";
        } else if (londonHour < 8) {
          nextSession = "London";
        } else if (nyHour < 9 || (nyHour === 9 && nyTime.getMinutes() < 30)) {
          nextSession = "New York";
        } else {
          nextSession = "Tokyo"; // Next day
        }
      } else {
        // Determine what comes after current session
        if (currentSession === "Tokyo") {
          nextSession = londonHour < 8 ? "London" : "New York";
        } else if (currentSession === "London") {
          nextSession =
            nyHour < 9 || (nyHour === 9 && nyTime.getMinutes() < 30)
              ? "New York"
              : "Tokyo";
        } else if (currentSession === "New York") {
          nextSession = "Tokyo";
        }
      }

      setSessionInfo({
        current: currentSession,
        currentDescription:
          currentSession !== "Market Closed"
            ? sessionData[currentSession as keyof typeof sessionData]
                ?.description || ""
            : "",
        currentCloses:
          currentSession !== "Market Closed"
            ? sessionData[currentSession as keyof typeof sessionData]?.closes ||
              ""
            : "",
        next: nextSession,
        nextDescription: sessionData[nextSession]?.description || "",
        nextOpens: sessionData[nextSession]?.opens || "",
      });
    };

    updateSessions();
    const timer = setInterval(updateSessions, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return sessionInfo;
}

export function WorldClockWidget() {
  const {
    current,
    currentDescription,
    currentCloses,
    next,
    nextDescription,
    nextOpens,
  } = useMarketSessions();

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
        <div className="mt-6 space-y-4">
          {/* Current Session */}
          <div className="relative overflow-hidden border bg-gradient-to-br from-background via-background to-muted/30 p-6 shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      current === "Market Closed"
                        ? "bg-red-500 animate-pulse"
                        : "bg-green-500 animate-pulse"
                    }`}
                  ></div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Current Session
                  </span>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                  {current !== "Market Closed" ? "LIVE" : "CLOSED"}
                </div>
              </div>

              <div className="mb-2">
                <h3
                  className={`text-2xl font-bold ${
                    current === "Market Closed"
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {current}
                </h3>
              </div>

              {current !== "Market Closed" && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    {currentDescription}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span>Closes at {currentCloses}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Session */}
          <div className="relative overflow-hidden border bg-gradient-to-br from-blue-50/50 via-background to-blue-50/30 p-6 shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Coming Up
                  </span>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  NEXT
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-2xl font-bold text-blue-600">{next}</h3>
              </div>

              {nextDescription && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    {nextDescription}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span>Opens at {nextOpens}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
