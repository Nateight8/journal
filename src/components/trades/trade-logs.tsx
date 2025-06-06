"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Info, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiErrorWarningLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiSearch2Line,
  RiMoreLine,
  RiFilter3Line,
  RiClipboardLine,
  RiFileTextLine,
} from "@remixicon/react";

import {
  TriangleDownIcon as RiArrowDownFill,
  TriangleUpIcon as RiArrowUpFill,
} from "@radix-ui/react-icons";

import {
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { createPortal } from "react-dom";
import LogDialog from "./log/log-dialog";
import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface Trade {
  id: string;
  date: string;
  symbol: string;
  direction: "Long" | "Short";
  projectedEntry: number;
  projectedSL: number | null;
  projectedTP: number | null;
  actualEntry: number | null;
  actualExit: number | null;
  didHitTP: boolean | null;
  actualPL: number | null;
  maxPossiblePL: number | null;
  efficiency: number | null;
  notes: string | null;
  accountId: string;
}

type TradeTooltipProps = {
  planned?: number | null;
  executed: number | null;
  className?: string;
};

function TradeTooltip({ planned, executed, className }: TradeTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTriggerRect(rect);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!triggerRect || !tooltipRef.current) return;

      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => {
        // Position tooltip 10px to the right of the cursor
        setPosition({
          x: e.clientX + 10,
          y: e.clientY - triggerRect.height / 2,
        });
      });
    },
    [triggerRect]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen, handleMouseMove]);

  // Determine the display value
  const displayValue =
    executed !== null
      ? `$${executed.toFixed(2)}`
      : planned !== null && planned !== undefined
      ? `$${planned.toFixed(2)}`
      : "N/A";

  return (
    <>
      <div
        className={cn("cursor-help", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {displayValue}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-50 flex flex-col gap-2 p-3 bg-background border rounded-lg shadow-lg pointer-events-none transition-[opacity,transform] duration-200 ease-out will-change-[transform,opacity]"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: "translate3d(0, -50%, 0)",
              opacity: isOpen ? 1 : 0,
            }}
          >
            {planned !== null && planned !== undefined && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs tracking-widest text-muted-foreground">
                  Planned
                </span>
                <span className="text-xs tracking-widest font-medium">
                  ${planned.toFixed(2)}
                </span>
              </div>
            )}
            {executed !== null && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs tracking-widest text-muted-foreground">
                  Actualized
                </span>
                <span className="text-xs tracking-widest font-medium">
                  ${executed.toFixed(2)}
                </span>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

type FilterState = {
  direction: ("Long" | "Short")[];
  dateRange: DateRange | undefined;
  efficiency: {
    min: number | undefined;
    max: number | undefined;
  };
};

const getColumns = (router: AppRouterInstance): ColumnDef<Trade>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Symbol",
    accessorKey: "symbol",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
          {row.original.symbol.slice(0, 2)}
        </div>
        <div className="font-medium text-muted-foreground">
          {row.getValue("symbol")}
        </div>
      </div>
    ),
    size: 120,
    enableHiding: false,
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.getValue("date")).toLocaleDateString()}
      </span>
    ),
    size: 100,
  },
  {
    header: "Direction",
    accessorKey: "direction",
    cell: ({ row }) => {
      const isLong = row.original.direction === "Long";
      return (
        <div className="flex items-center gap-2">
          {isLong ? (
            <RiArrowUpFill className="size-4 text-primary" />
          ) : (
            <RiArrowDownFill className="size-4 text-destructive" />
          )}
          <span
            className={cn(
              "font-medium",
              isLong ? "text-primary" : "text-destructive"
            )}
          >
            {isLong ? "BUY" : "SELL"}
          </span>
        </div>
      );
    },
    size: 100,
  },
  {
    header: "Entry",
    accessorKey: "actualEntry",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <TradeTooltip
          planned={row.original.projectedEntry}
          executed={row.original.actualEntry}
          className="text-muted-foreground"
        />
        <span className="text-xs text-muted-foreground/70">
          Target: ${row.original.projectedEntry.toFixed(2)}
        </span>
      </div>
    ),
    size: 120,
  },
  {
    header: "Stop Loss",
    accessorKey: "projectedSL",
    cell: ({ row }) => {
      const projectedSL = row.original.projectedSL;
      return (
        <div className="flex flex-col">
          <TradeTooltip
            planned={projectedSL ?? 0}
            executed={projectedSL}
            className="text-muted-foreground"
          />
          <span className="text-xs text-muted-foreground/70">
            {projectedSL !== null
              ? `Risk: $${Math.abs(
                  row.original.projectedEntry - projectedSL
                ).toFixed(2)}`
              : "No stop loss"}
          </span>
        </div>
      );
    },
    size: 120,
  },
  {
    header: "Take Profit",
    accessorKey: "projectedTP",
    cell: ({ row }) => {
      const projectedTP = row.original.projectedTP;
      const executed =
        row.original.didHitTP === true ? projectedTP : row.original.actualExit;

      return (
        <div className="flex flex-col">
          <TradeTooltip
            planned={projectedTP ?? 0}
            executed={executed}
            className="text-muted-foreground"
          />
          <span className="text-xs text-muted-foreground/70">
            {projectedTP !== null
              ? `Reward: $${Math.abs(
                  projectedTP - row.original.projectedEntry
                ).toFixed(2)}`
              : "No take profit"}
          </span>
        </div>
      );
    },
    size: 120,
  },
  {
    header: "P/L",
    accessorKey: "actualPL",
    cell: ({ row }) => {
      const pl = row.original.actualPL;
      const isPositive = pl !== null && pl > 0;

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "font-medium",
                pl === null
                  ? "text-muted-foreground/60"
                  : isPositive
                  ? "text-primary"
                  : "text-destructive"
              )}
            >
              {pl !== null
                ? `$${Math.abs(pl).toFixed(2)} ${isPositive ? "+" : "-"}`
                : "-"}
            </span>
            {pl === null && (
              <div className="relative group">
                <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                <div className="absolute left-full ml-1 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  Calculated upon trade closure
                </div>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground/70">
            Max:{" "}
            {row.original.maxPossiblePL !== null
              ? `$${row.original.maxPossiblePL.toFixed(2)}`
              : "-"}
          </span>
        </div>
      );
    },
    size: 120,
  },
  {
    header: "Efficiency",
    accessorKey: "efficiency",
    cell: ({ row }) => {
      const trade = row.original;
      const efficiency = trade.efficiency;

      if (efficiency === null) {
        return (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground/40">-</span>
          </div>
        );
      }

      // Normalize for display (0-100%)
      const normalizedEfficiency = Math.min(Math.max(efficiency, -100), 100);
      const displayEfficiency = Math.abs(normalizedEfficiency).toFixed(1);
      const isPositive = normalizedEfficiency >= 0;

      // Calculate risk-reward ratio if possible
      let riskRewardInfo = null;
      if (
        trade.projectedTP !== null &&
        trade.projectedSL !== null &&
        trade.projectedEntry
      ) {
        const risk = Math.abs(
          trade.projectedEntry - (trade.projectedSL || trade.projectedEntry)
        );
        const reward = Math.abs(
          (trade.projectedTP || trade.projectedEntry) - trade.projectedEntry
        );
        if (risk > 0) {
          const rrRatio = (reward / risk).toFixed(2);
          riskRewardInfo = `R:R ${rrRatio}`;
        }
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-full w-full items-center px-2">
                <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isPositive ? "bg-primary" : "bg-destructive"
                    )}
                    style={{ width: `${Math.abs(normalizedEfficiency)}%` }}
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px] p-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span
                    className={cn(
                      "font-medium",
                      isPositive ? "text-primary" : "text-destructive"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {displayEfficiency}%
                  </span>
                </div>

                {trade.actualPL !== null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">P/L:</span>
                    <span
                      className={cn(
                        "font-medium",
                        trade.actualPL >= 0
                          ? "text-primary"
                          : "text-destructive"
                      )}
                    >
                      {trade.actualPL >= 0 ? "+" : ""}
                      {trade.actualPL.toFixed(2)}
                    </span>
                  </div>
                )}

                {riskRewardInfo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk/Reward:</span>
                    <span className="font-medium">{riskRewardInfo}</span>
                  </div>
                )}

                {trade.maxPossiblePL !== null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Max Potential:
                    </span>
                    <span className="font-medium">
                      {trade.maxPossiblePL >= 0 ? "+" : ""}
                      {trade.maxPossiblePL.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    size: 100,
  },
  {
    header: "Notes",
    accessorKey: "notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string | null;
      const hasNotes = notes && notes.trim().length > 0;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => router.push(`/journal/${row.original.id}`)}
                className="flex h-full w-full items-center justify-center cursor-pointer hover:text-primary transition-colors"
              >
                {hasNotes ? (
                  <RiFileTextLine className="size-4" />
                ) : (
                  <RiClipboardLine className="size-4 text-muted-foreground/40" />
                )}
              </button>
            </TooltipTrigger>
            {hasNotes && (
              <TooltipContent side="right" className="max-w-[300px]">
                <p className="text-sm line-clamp-3">{notes}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    },
    size: 40,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <RiMoreLine className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit trade</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            Delete trade
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 60,
    enableHiding: false,
  },
];

type TradeLogsProps = {
  trades: Trade[];
};

export default function TradeLogs({ trades }: TradeLogsProps) {
  const router = useRouter();
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<FilterState>({
    direction: [],
    dateRange: undefined,
    efficiency: {
      min: undefined,
      max: undefined,
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "date",
      desc: true,
    },
  ]);

  const columns = useMemo(() => getColumns(router), [router]);

  const filteredData = useMemo(() => {
    return trades.filter((trade) => {
      if (
        filters.direction.length > 0 &&
        !filters.direction.includes(trade.direction)
      ) {
        return false;
      }

      if (filters.dateRange?.from) {
        const tradeDate = new Date(trade.date);
        if (tradeDate < filters.dateRange.from) {
          return false;
        }
      }
      if (filters.dateRange?.to) {
        const tradeDate = new Date(trade.date);
        if (tradeDate > filters.dateRange.to) {
          return false;
        }
      }

      if (
        filters.efficiency.min !== undefined &&
        (trade.efficiency === null || trade.efficiency < filters.efficiency.min)
      ) {
        return false;
      }
      if (
        filters.efficiency.max !== undefined &&
        (trade.efficiency === null || trade.efficiency > filters.efficiency.max)
      ) {
        return false;
      }

      return true;
    });
  }, [filters, trades]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  const resetFilters = () => {
    setFilters({
      direction: [],
      dateRange: undefined,
      efficiency: {
        min: undefined,
        max: undefined,
      },
    });
  };

  // Click outside to close mobile search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchExpanded(false);
      }
    };

    if (isMobileSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSearchExpanded]);

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Left side - Search */}
        <div className="flex items-center">
          {/* Mobile Search Button/Input */}
          <div className="md:hidden" ref={mobileSearchRef}>
            {!isMobileSearchExpanded ? (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMobileSearchExpanded(true)}
                aria-label="Search"
              >
                <RiSearch2Line className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Input
                    id={`${id}-mobile-input`}
                    className={cn(
                      "peer ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent",
                      Boolean(table.getColumn("symbol")?.getFilterValue()) &&
                        "pe-9"
                    )}
                    value={
                      (table.getColumn("symbol")?.getFilterValue() ??
                        "") as string
                    }
                    onChange={(e) =>
                      table.getColumn("symbol")?.setFilterValue(e.target.value)
                    }
                    placeholder="Search by symbol"
                    type="text"
                    aria-label="Search by symbol"
                    autoFocus
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
                    <RiSearch2Line size={20} aria-hidden="true" />
                  </div>
                  {Boolean(table.getColumn("symbol")?.getFilterValue()) && (
                    <button
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Clear filter"
                      onClick={() => {
                        table.getColumn("symbol")?.setFilterValue("");
                      }}
                    >
                      <RiCloseCircleLine size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Search - always visible on desktop */}
          <div className="hidden md:block">
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn(
                  "peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent",
                  Boolean(table.getColumn("symbol")?.getFilterValue()) && "pe-9"
                )}
                value={
                  (table.getColumn("symbol")?.getFilterValue() ?? "") as string
                }
                onChange={(e) =>
                  table.getColumn("symbol")?.setFilterValue(e.target.value)
                }
                placeholder="Search by symbol"
                type="text"
                aria-label="Search by symbol"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
                <RiSearch2Line size={20} aria-hidden="true" />
              </div>
              {Boolean(table.getColumn("symbol")?.getFilterValue()) && (
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear filter"
                  onClick={() => {
                    table.getColumn("symbol")?.setFilterValue("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <RiCloseCircleLine size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Filter and Journal buttons */}
        {!isMobileSearchExpanded && (
          <div className="flex items-center gap-3">
            {/* Delete button */}
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="ml-auto" variant="outline">
                    <RiDeleteBinLine
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {table.getSelectedRowModel().rows.length}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                      aria-hidden="true"
                    >
                      <RiErrorWarningLine className="opacity-80" size={16} />
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete {table.getSelectedRowModel().rows.length}{" "}
                        selected{" "}
                        {table.getSelectedRowModel().rows.length === 1
                          ? "trade"
                          : "trades"}
                        .
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {}}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Filter button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative md:px-3 md:gap-2">
                  <RiFilter3Line
                    className="size-4 text-muted-foreground/60"
                    aria-hidden="true"
                  />
                  <span className="hidden md:inline">Filters</span>
                  {(filters.direction.length > 0 ||
                    filters.dateRange ||
                    filters.efficiency.min !== undefined ||
                    filters.efficiency.max !== undefined) && (
                    <>
                      <span className="absolute -right-1 -top-1 flex h-3 w-3 md:hidden">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                      </span>
                      <span className="hidden md:inline-flex items-center justify-center h-5 min-w-5 px-1 ml-2 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                        {[
                          filters.direction.length,
                          filters.dateRange ? 1 : 0,
                          filters.efficiency.min !== undefined ? 1 : 0,
                          filters.efficiency.max !== undefined ? 1 : 0,
                        ].reduce((a, b) => a + b, 0)}
                      </span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto min-w-[300px] p-4"
                align="start"
              >
                <div className="space-y-4">
                  {/* Direction filter */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground/60">
                      Direction
                    </Label>
                    <div className="space-y-2">
                      {["Long", "Short"].map((dir) => (
                        <div key={dir} className="flex items-center gap-2">
                          <Checkbox
                            id={`${id}-${dir}`}
                            checked={filters.direction.includes(
                              dir as "Long" | "Short"
                            )}
                            onCheckedChange={(checked) => {
                              setFilters((prev) => ({
                                ...prev,
                                direction: checked
                                  ? [...prev.direction, dir as "Long" | "Short"]
                                  : prev.direction.filter((d) => d !== dir),
                              }));
                            }}
                          />
                          <Label
                            htmlFor={`${id}-${dir}`}
                            className="flex grow justify-between gap-2 font-normal"
                          >
                            {dir === "Long" ? "BUY" : "SELL"}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date range filter */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground/60">
                      Date Range
                    </Label>
                    <Calendar
                      mode="range"
                      selected={filters.dateRange}
                      onSelect={(range) =>
                        setFilters((prev) => ({ ...prev, dateRange: range }))
                      }
                      numberOfMonths={2}
                      className="rounded-md border"
                    />
                  </div>

                  {/* Efficiency filter */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground/60">
                      Efficiency
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`${id}-min-eff`} className="text-xs">
                          Min %
                        </Label>
                        <Input
                          id={`${id}-min-eff`}
                          type="number"
                          placeholder="Min"
                          value={filters.efficiency.min ?? ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              efficiency: {
                                ...prev.efficiency,
                                min: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`${id}-max-eff`} className="text-xs">
                          Max %
                        </Label>
                        <Input
                          id={`${id}-max-eff`}
                          type="number"
                          placeholder="Max"
                          value={filters.efficiency.max ?? ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              efficiency: {
                                ...prev.efficiency,
                                max: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reset filters */}
                  {(filters.direction.length > 0 ||
                    filters.dateRange ||
                    filters.efficiency.min !== undefined ||
                    filters.efficiency.max !== undefined) && (
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={resetFilters}
                    >
                      Reset filters
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Journal button - icon only on mobile, full button on desktop */}
            <LogDialog />
          </div>
        )}
      </div>

      {/* Table */}
      <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex h-full cursor-pointer select-none items-center gap-2"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (
                            header.column.getCanSort() &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <RiArrowUpSLine
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                          desc: (
                            <RiArrowDownSLine
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((tableRow) => (
              <TableRow
                key={tableRow.id}
                data-state={tableRow.getIsSelected() && "selected"}
                className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
              >
                {tableRow.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="last:py-0 h-[inherit]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
      </Table>

      {/* Pagination */}
      {table.getRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p
            className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
            aria-live="polite"
          >
            Page{" "}
            <span className="text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className="text-foreground">{table.getPageCount()}</span>
          </p>
          <Pagination className="w-auto">
            <PaginationContent className="gap-3">
              <PaginationItem>
                <Button
                  variant="outline"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
