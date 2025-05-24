"use client";

import { cn } from "@/lib/utils";
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
import { Progress } from "@/components/ui/progress";
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
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
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
import { DateRange } from "react-day-picker";
import { createPortal } from "react-dom";
import LogDialog from "@/components/trades/log/log-dialog";

export type Trade = {
  id: string;
  date: string;
  symbol: string;
  direction: "Long" | "Short";
  projectedEntry: number;
  projectedSL: number;
  projectedTP: number;
  actualEntry: number | null;
  actualExit: number | null;
  didHitTP: boolean | null;
  actualPL: number | null;
  maxPossiblePL: number | null;
  efficiency: number | null;
  notes: string | null;
  accountId: string;
};

type TradeTooltipProps = {
  planned: number;
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

  return (
    <>
      <div
        className={cn("cursor-help", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {executed !== null ? `$${executed.toFixed(2)}` : "-"}
      </div>
      {isOpen &&
        executed !== null &&
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
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs tracking-widest text-muted-foreground">
                Planned
              </span>
              <span className="text-xs tracking-widest font-medium">
                ${planned.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs tracking-widest text-muted-foreground">
                Actualized
              </span>
              <span className="text-xs tracking-widest font-medium">
                ${executed.toFixed(2)}
              </span>
            </div>
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

const getColumns = (): ColumnDef<Trade>[] => [
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
    cell: ({ row }) => (
      <div className="flex flex-col">
        <TradeTooltip
          planned={row.original.projectedSL}
          executed={row.original.projectedSL}
          className="text-muted-foreground"
        />
        <span className="text-xs text-muted-foreground/70">
          Risk: $
          {Math.abs(
            row.original.projectedEntry - row.original.projectedSL
          ).toFixed(2)}
        </span>
      </div>
    ),
    size: 120,
  },
  {
    header: "Take Profit",
    accessorKey: "projectedTP",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <TradeTooltip
          planned={row.original.projectedTP}
          executed={
            row.original.didHitTP === true
              ? row.original.projectedTP
              : row.original.actualExit
          }
          className="text-muted-foreground"
        />
        <span className="text-xs text-muted-foreground/70">
          Reward: $
          {Math.abs(
            row.original.projectedTP - row.original.projectedEntry
          ).toFixed(2)}
        </span>
      </div>
    ),
    size: 120,
  },
  {
    header: "P/L",
    accessorKey: "actualPL",
    cell: ({ row }) => {
      const pl = row.original.actualPL;
      if (pl === null) {
        return (
          <div className="flex flex-col">
            <span className="text-muted-foreground/60">-</span>
            <span className="text-xs text-muted-foreground/70">
              Max:{" "}
              {row.original.maxPossiblePL !== null
                ? `$${row.original.maxPossiblePL.toFixed(2)}`
                : "-"}
            </span>
          </div>
        );
      }
      const isPositive = pl > 0;
      return (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-medium",
              isPositive ? "text-primary" : "text-destructive"
            )}
          >
            ${Math.abs(pl).toFixed(2)} {isPositive ? "+" : "-"}
          </span>
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
      const efficiency = row.original.efficiency;
      if (efficiency === null) {
        return (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground/40">-</span>
          </div>
        );
      }
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-full w-full items-center">
                <Progress
                  className={cn(
                    "h-1 max-w-14",
                    efficiency >= 0 ? "bg-primary/20" : "bg-destructive/20",
                    efficiency >= 0
                      ? "[&>div]:bg-primary"
                      : "[&>div]:bg-destructive"
                  )}
                  value={Math.abs(efficiency)}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent align="start" sideOffset={-8}>
              <p className="text-muted-foreground">{efficiency}%</p>
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
              <button className="flex h-full w-full items-center justify-center cursor-pointer">
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

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "date",
      desc: true,
    },
  ]);

  const columns = useMemo(() => getColumns(), []);

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

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Filter by symbol */}
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

          {/* Filter button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <RiFilter3Line
                  className="size-5 -ms-1.5 text-muted-foreground/60"
                  size={20}
                  aria-hidden="true"
                />
                Filters
                {(filters.direction.length > 0 ||
                  filters.dateRange ||
                  filters.efficiency.min !== undefined ||
                  filters.efficiency.max !== undefined) && (
                  <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    Active
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[300px] p-4" align="start">
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
        </div>
        {/* Right side */}
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
                  Delete
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
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
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
          {/* log trade button */}
          <LogDialog />
        </div>
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
