"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { NumberField } from "@/components/ui/number-field";
import { Textarea } from "@/components/ui/textarea";
import { useApolloClient, useMutation } from "@apollo/client";
import journalOperations from "@/graphql/journal-operationsl";
import { useLogDialog } from "./log-dialog-context";

export const TargetSchema = z.object({
  label: z.string().min(1, { message: "Label is required" }),
  executedPrice: z.number({ invalid_type_error: "Must be a number" }),
  riskReward: z.number({ invalid_type_error: "Must be a number" }),
  exitSize: z.number({ invalid_type_error: "Must be a number" }),
  moveStopTo: z.number({ invalid_type_error: "Must be a number" }),
});

export const closeTradeSchema = z.object({
  exitPrice: z.coerce.number().positive("Exit price must be a positive number"),
});

type CloseTradeFormData = z.infer<typeof closeTradeSchema>;

type LogFormValues = {
  instrument: string;
  plannedEntryPrice?: number;
  plannedStopLoss?: number;
  plannedTakeProfit?: number;
  size?: number;
  executionStyle: "MARKET" | "LIMIT";
  side: "buy" | "sell";
  setupType?: string;
  timeframe?: string;
  notes?: string;
  tags?: string[];
};

export const LogFormSchema = z.object({
  instrument: z.string().min(1, { message: "Instrument is required" }),
  plannedEntryPrice: z.coerce
    .number()
    .positive("Exit price must be a positive number"),
  plannedStopLoss: z.coerce
    .number()
    .positive("Exit price must be a positive number"),
  plannedTakeProfit: z.coerce
    .number()
    .positive("Exit price must be a positive number")
    .optional(),
  size: z.coerce.number().positive("Exit price must be a positive number"),
  executionStyle: z.enum(["MARKET", "LIMIT"], {
    required_error: "Execution style is required",
  }),
  side: z.enum(["buy", "sell"], { required_error: "Side is required" }),
  setupType: z.string().optional(),
  timeframe: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
}) satisfies z.ZodType<LogFormValues>;

export const executeTradeSchema = z.object({
  executedEntryPrice: z.coerce
    .number()
    .positive("Exit entry must be a positive number"),
  executedStopLoss: z.coerce
    .number()
    .positive("Exit stop must be a positive number"),
  executionNotes: z.string().max(1000).optional(),
});

type ExecuteTradeValues = z.infer<typeof executeTradeSchema>;
type LogFormData = z.infer<typeof LogFormSchema>;
// type ExecuteTradeProps = {
//   trade: {
//     plannedEntryPrice: number;
//     plannedStopLoss: number;
//   };
// };

type LogTradeProps = {
  selectedAccountIds: string[];
};

export function LogTrade({ selectedAccountIds }: LogTradeProps) {
  const form = useForm<LogFormData>({
    resolver: zodResolver(LogFormSchema),
    defaultValues: {
      executionStyle: "MARKET",
      side: "buy",
      plannedEntryPrice: undefined,
      plannedStopLoss: undefined,
      plannedTakeProfit: undefined,
      size: undefined,
    },
  });

  const client = useApolloClient();
  const { closeDialog } = useLogDialog();

  const [createTrade] = useMutation(journalOperations.Mutations.createJournal, {
    onCompleted: () => {
      // Close the dialog
      form.reset();
      // Invalidate and refetch the journals query
      client.refetchQueries({
        include: [journalOperations.Queries.getJournals],
      });
      // Close the dialog using context
      closeDialog();
    },
  });

  function onSubmit(data: LogFormValues) {
    createTrade({
      variables: {
        input: {
          instrument: data.instrument,
          plannedEntryPrice: data.plannedEntryPrice,
          plannedStopLoss: data.plannedStopLoss,
          plannedTakeProfit: data.plannedTakeProfit,
          size: data.size,
          executionStyle: data.executionStyle,
          side: data.side,
          setupType: data.setupType,
          timeframe: data.timeframe,
          notes: data.notes,
          tags: data.tags,
          accountId: selectedAccountIds,
        },
      },
    });
  }

  //   const limitOrder = executionStyle === "on";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
        })}
        className="w-full space-y-2 py-2"
      >
        <FormField
          control={form.control}
          name="instrument"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="eg. EURUSD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Execution Style: Market or Limit */}
        <div className="py-4">
          <FormField
            control={form.control}
            name="executionStyle"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <div className="bg-input/50 inline-flex h-10 w-full rounded-md p-0.5">
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium relative"
                    >
                      <div
                        className="absolute inset-y-0 w-1/2 rounded-sm shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-background"
                        style={{
                          transform:
                            field.value === "LIMIT"
                              ? "translateX(100%)"
                              : "translateX(0)",
                        }}
                      />
                      <label
                        className={cn(
                          "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none",
                          field.value === "MARKET"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        Market
                        <RadioGroupItem
                          id="MARKET"
                          value="MARKET"
                          className="sr-only"
                        />
                      </label>
                      <label
                        className={cn(
                          "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none",
                          field.value === "LIMIT"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        Limit
                        <RadioGroupItem
                          id="LIMIT"
                          value="LIMIT"
                          className="sr-only"
                        />
                      </label>
                    </RadioGroup>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="plannedEntryPrice"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Entry Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Side: Buy or Sell */}
        <FormField
          control={form.control}
          name="side"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <div className="bg-input/50 inline-flex h-10 w-full rounded-md p-0.5">
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium relative"
                  >
                    <div
                      className="absolute inset-y-0 w-1/2 rounded-sm shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-background"
                      style={{
                        transform:
                          field.value === "sell"
                            ? "translateX(100%)"
                            : "translateX(0)",
                      }}
                    />
                    <label
                      className={cn(
                        "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none rounded-md",
                        field.value === "buy"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Buy
                      <RadioGroupItem
                        id="buy"
                        value="buy"
                        className="sr-only"
                      />
                    </label>
                    <label
                      className={cn(
                        "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none rounded-md",
                        field.value === "sell"
                          ? "bg-destructive text-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Sell
                      <RadioGroupItem
                        id="sell"
                        value="sell"
                        className="sr-only"
                      />
                    </label>
                  </RadioGroup>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <div className=" flex-1">
            <FormField
              control={form.control}
              name="plannedStopLoss"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-muted/30"
                      placeholder="Stop Loss"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" flex-1">
            <FormField
              control={form.control}
              name="plannedTakeProfit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-muted/30"
                      placeholder="Take Profit"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 py-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumberField {...field} placeholder="lot size" />
                </FormControl>
              </FormItem>
            )}
          />

          <Button variant="default" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ModifyLof() {
  const form = useForm<LogFormData>({
    resolver: zodResolver(LogFormSchema),
    defaultValues: {
      executionStyle: "MARKET",
      side: "buy",
      plannedEntryPrice: undefined,
      plannedStopLoss: undefined,
      plannedTakeProfit: undefined,
      size: undefined,
    },
  });

  function onSubmit(data: LogFormValues) {
    console.log(data);
  }

  //   const limitOrder = executionStyle === "on";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
        })}
        className="w-full space-y-2 py-2"
      >
        <FormField
          control={form.control}
          name="instrument"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="eg. EURUSD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Execution Style: Market or Limit */}
        <div className="py-4">
          <FormField
            control={form.control}
            name="executionStyle"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <div className="bg-input/50 inline-flex h-10 w-full rounded-md p-0.5">
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium relative"
                    >
                      <div
                        className="absolute inset-y-0 w-1/2 rounded-sm shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-background"
                        style={{
                          transform:
                            field.value === "LIMIT"
                              ? "translateX(100%)"
                              : "translateX(0)",
                        }}
                      />
                      <label
                        className={cn(
                          "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none",
                          field.value === "MARKET"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        Market
                        <RadioGroupItem
                          id="MARKET"
                          value="MARKET"
                          className="sr-only"
                        />
                      </label>
                      <label
                        className={cn(
                          "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none",
                          field.value === "LIMIT"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        Limit
                        <RadioGroupItem
                          id="LIMIT"
                          value="LIMIT"
                          className="sr-only"
                        />
                      </label>
                    </RadioGroup>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="plannedEntryPrice"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Entry Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Side: Buy or Sell */}
        <FormField
          control={form.control}
          name="side"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <div className="bg-input/50 inline-flex h-10 w-full rounded-md p-0.5">
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium relative"
                  >
                    <div
                      className="absolute inset-y-0 w-1/2 rounded-sm shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-background"
                      style={{
                        transform:
                          field.value === "sell"
                            ? "translateX(100%)"
                            : "translateX(0)",
                      }}
                    />
                    <label
                      className={cn(
                        "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none rounded-md",
                        field.value === "buy"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Buy
                      <RadioGroupItem
                        id="buy"
                        value="buy"
                        className="sr-only"
                      />
                    </label>
                    <label
                      className={cn(
                        "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none rounded-md",
                        field.value === "sell"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Sell
                      <RadioGroupItem
                        id="sell"
                        value="sell"
                        className="sr-only"
                      />
                    </label>
                  </RadioGroup>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <div className=" flex-1">
            <FormField
              control={form.control}
              name="plannedStopLoss"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-muted/30"
                      placeholder="Stop Loss"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" flex-1">
            <FormField
              control={form.control}
              name="plannedTakeProfit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-muted/30"
                      placeholder="Take Profit"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 py-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumberField {...field} placeholder="lot size" />
                </FormControl>
              </FormItem>
            )}
          />

          <Button variant="default" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function Executed() {
  const form = useForm<ExecuteTradeValues>({
    resolver: zodResolver(executeTradeSchema),
    defaultValues: {
      executedEntryPrice: undefined,
      executedStopLoss: undefined,
      executionNotes: "",
    },
  });

  //   const [executeTrade] = useMutation(tradeOperations.Mutations.executeTrade);

  function onSubmit(data: ExecuteTradeValues) {
    console.log("executed", data);
    // executeTrade({
    //   variables: {
    //     input: {
    //       id: trade.id,
    //       ...data,
    //     },
    //   },
    // });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="executedEntryPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="adjusted entry?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="executedStopLoss"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="adjusted sl?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="executionNotes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="your execution notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full">Confirm</Button>
        </form>
      </Form>
      <button
        // onClick={() => {
        //   form.setValue("executedEntryPrice", trade.plannedEntryPrice!);
        //   form.setValue("executedStopLoss", trade.plannedStopLoss!);
        // }}
        className="text-xs hover:text-primary focus:outline-none p-2 cursor-pointer shadow-sm"
        type="button"
      >
        Apply logged values if unchanged
      </button>
    </>
  );
}

export function Close() {
  const form = useForm<CloseTradeFormData>({
    resolver: zodResolver(closeTradeSchema),
    defaultValues: {
      exitPrice: undefined,
    },
  });

  //   const [closeTrade] = useMutation(tradeOperations.Mutations.closeTrade);

  function onSubmit(data: CloseTradeFormData) {
    const result = closeTradeSchema.parse(data);
    console.log("close", result);
    // closeTrade({
    //   variables: {
    //     input: {
    //       tradeId: trade.id,
    //       exitPrice: result.exitPrice
    //     }
    //   },
    // });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="exitPrice"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="closing price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full">Confirm</Button>
        </form>
      </Form>
      <button
        onClick={() => {
          //   form.setValue("exitPrice", trade.plannedEntryPrice!);
        }}
        className="text-xs hover:text-primary focus:outline-none p-2 cursor-pointer shadow-sm"
        type="button"
      >
        Click if you held to TP
      </button>
    </>
  );
}
