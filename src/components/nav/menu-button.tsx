"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

function MenuButton() {
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={() => setActive(!active)}
      className="size-4 border grid grid-cols-3 gap-0.5 grid-rows-3 hover:cursor-pointer"
    >
      <div
        className={`bg-muted-foreground size-1 ${active && " rounded-full"}`}
      ></div>
      <div className="bg-muted-foreground size-1"></div>{" "}
      <div className="bg-muted-foreground size-1"></div>{" "}
      <div
        className={`bg-muted-foreground size-1 ${
          active && "bg-muted-foreground  rounded-full"
        }`}
      ></div>{" "}
      <div className="bg-muted-foreground size-1"></div>{" "}
      <div
        className={`bg-muted-foreground size-1 ${
          active && "bg-transparent border rounded-full"
        }`}
      ></div>{" "}
      <div className="bg-muted-foreground size-1"></div>{" "}
      <div
        className={`bg-muted-foreground size-1 ${
          active && "bg-muted-foreground/50 rounded-full"
        }`}
      ></div>{" "}
      <div className="bg-muted-foreground size-1"></div>{" "}
    </button>
  );
}

export function MenuSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <MenuButton />
      </SheetTrigger>
      <SheetContent side="left"></SheetContent>
    </Sheet>
  );
}
