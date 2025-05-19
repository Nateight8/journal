// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { cn } from "@/lib/utils";
// import { NumberField } from "@/components/ui/number-field";
// import { useMutation } from "@apollo/client";
// import tradeOperations from "@/graphql/operations/trade";

// export const TargetSchema = z.object({
//   label: z.string().min(1, { message: "Label is required" }),
//   executedPrice: z.number({ invalid_type_error: "Must be a number" }),
//   riskReward: z.number({ invalid_type_error: "Must be a number" }),
//   exitSize: z.number({ invalid_type_error: "Must be a number" }),
//   moveStopTo: z.number({ invalid_type_error: "Must be a number" }),
// });

// export const LogFormSchema = z.object({
//   instrument: z.string().min(1, { message: "Instrument is required" }),

//   plannedEntryPrice: z.preprocess(
//     (val) => (val === "" ? undefined : Number(val)),
//     z
//       .number({ invalid_type_error: "Must be a number" })
//       .gt(0, { message: "Entry price must be greater than 0" })
//   ),
//   plannedStopLoss: z.preprocess(
//     (val) => (val === "" ? undefined : Number(val)),
//     z
//       .number({ invalid_type_error: "Must be a number" })
//       .gt(0, { message: "Stop loss must be greater than 0" })
//   ),
//   plannedTakeProfit: z.preprocess(
//     (val) => (val === "" ? undefined : Number(val)),
//     z
//       .number({ invalid_type_error: "Must be a number" })
//       .gt(0, { message: "Take profit must be greater than 0" })
//   ),
//   size: z.preprocess(
//     (val) => (val === "" ? undefined : Number(val)),
//     z
//       .number({ invalid_type_error: "Must be a number" })
//       .gt(0, { message: "Size must be greater than 0" })
//   ),
//   executionStyle: z.enum(["MARKET", "LIMIT"], {
//     required_error: "Execution style is required",
//   }),
//   side: z.enum(["buy", "sell"], { required_error: "Side is required" }),

//   // Optional/nullable fields:
//   setupType: z.string().optional(),
//   timeframe: z.string().optional(),
//   notes: z.string().optional(),
//   tags: z.array(z.string()).optional(),
// });

// export function LogForm({ accountId }: { accountId: string }) {
//   const form = useForm<z.infer<typeof LogFormSchema>>({
//     resolver: zodResolver(LogFormSchema),
//     defaultValues: {
//       executionStyle: "MARKET",
//       side: "buy",
//       plannedEntryPrice: undefined,
//       plannedStopLoss: undefined,
//       plannedTakeProfit: undefined,
//       size: undefined,
//     },
//   });

//   const [logTrade] = useMutation(tradeOperations.Mutations.logTrade);

//   function onSubmit(data: z.infer<typeof LogFormSchema>) {
//     console.log(data);
//     console.log(accountId);
//     logTrade({
//       variables: {
//         input: {
//           accountId,
//           ...data,
//         },
//       },
//     });
//   }

//   //   const limitOrder = executionStyle === "on";

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit, (errors) => {
//           console.error("Form validation errors:", errors);
//         })}
//         className="w-full space-y-2 py-2"
//       >
//         <FormField
//           control={form.control}
//           name="instrument"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <Input placeholder="eg. EURUSD" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         {/* Execution Style: Market or Limit */}
//         <div className="py-4">
//           <FormField
//             control={form.control}
//             name="executionStyle"
//             render={({ field }) => (
//               <FormItem className="space-y-3">
//                 <FormControl>
//                   <div className="bg-input/50 inline-flex h-10 w-full rounded-md p-0.5">
//                     <RadioGroup
//                       value={field.value}
//                       onValueChange={field.onChange}
//                       className="w-full inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium relative"
//                     >
//                       <div
//                         className="absolute inset-y-0 w-1/2 rounded-sm shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-background"
//                         style={{
//                           transform:
//                             field.value === "LIMIT"
//                               ? "translateX(100%)"
//                               : "translateX(0)",
//                         }}
//                       />
//                       <label
//                         className={cn(
//                           "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none",
//                           field.value === "MARKET"
//                             ? "text-foreground"
//                             : "text-muted-foreground"
//                         )}
//                       >
//                         Market
//                         <RadioGroupItem
//                           id="MARKET"
//                           value="MARKET"
//                           className="sr-only"
//                         />
//                       </label>
//                       <label
//                         className={cn(
//                           "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none",
//                           field.value === "LIMIT"
//                             ? "text-foreground"
//                             : "text-muted-foreground"
//                         )}
//                       >
//                         Limit
//                         <RadioGroupItem
//                           id="LIMIT"
//                           value="LIMIT"
//                           className="sr-only"
//                         />
//                       </label>
//                     </RadioGroup>
//                   </div>
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>
//         <FormField
//           control={form.control}
//           name="plannedEntryPrice"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <Input placeholder="Entry Price" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Side: Buy or Sell */}
//         <FormField
//           control={form.control}
//           name="side"
//           render={({ field }) => (
//             <FormItem className="space-y-3">
//               <FormControl>
//                 <div className="bg-input/50 inline-flex h-10 w-full rounded-md p-0.5">
//                   <RadioGroup
//                     value={field.value}
//                     onValueChange={field.onChange}
//                     className="w-full inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium relative"
//                   >
//                     <div
//                       className="absolute inset-y-0 w-1/2 rounded-sm shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-background"
//                       style={{
//                         transform:
//                           field.value === "sell"
//                             ? "translateX(100%)"
//                             : "translateX(0)",
//                       }}
//                     />
//                     <label
//                       className={cn(
//                         "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none rounded-md",
//                         field.value === "buy"
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-muted text-muted-foreground"
//                       )}
//                     >
//                       Buy
//                       <RadioGroupItem
//                         id="buy"
//                         value="buy"
//                         className="sr-only"
//                       />
//                     </label>
//                     <label
//                       className={cn(
//                         "relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none rounded-md",
//                         field.value === "sell"
//                           ? "bg-destructive text-destructive-foreground"
//                           : "bg-muted text-muted-foreground"
//                       )}
//                     >
//                       Sell
//                       <RadioGroupItem
//                         id="sell"
//                         value="sell"
//                         className="sr-only"
//                       />
//                     </label>
//                   </RadioGroup>
//                 </div>
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         <div className="flex gap-2">
//           <div className=" flex-1">
//             <FormField
//               control={form.control}
//               name="plannedStopLoss"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input
//                       className="bg-muted/30"
//                       placeholder="Stop Loss"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className=" flex-1">
//             <FormField
//               control={form.control}
//               name="plannedTakeProfit"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input
//                       className="bg-muted/30"
//                       placeholder="Take Profit"
//                       {...field}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-2 py-4">
//           <FormField
//             control={form.control}
//             name="size"
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <NumberField {...field} placeholder="lot size" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />

//           <Button variant="tertiary" type="submit">
//             Submit
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
