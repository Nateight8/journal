import { Onboard } from "./_components/onboard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <Onboard />
    </main>
  );
}

import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InitialStepsFormValues } from "../initial-steps-form";
import { FormError } from "../form-error";

interface TradingIdentityProps {
  form: UseFormReturn<InitialStepsFormValues>;
}

export function TradingIdentity({ form }: TradingIdentityProps) {
  const propFirms = [
    { id: "ftmo", name: "FTMO" },
    { id: "topstep", name: "Topstep" },
    { id: "fundedNext", name: "Funded Next" },
    { id: "cityTraders", name: "City Traders Imperium" },
    { id: "other", name: "Other" },
  ];

  const currencies = [
    { id: "USD", name: "USD - US Dollar" },
    { id: "EUR", name: "EUR - Euro" },
    { id: "GBP", name: "GBP - British Pound" },
    { id: "JPY", name: "JPY - Japanese Yen" },
    { id: "AUD", name: "AUD - Australian Dollar" },
  ];

  const accountSizes = [
    { id: "5000", name: "$5,000" },
    { id: "10000", name: "$10,000" },
    { id: "25000", name: "$25,000" },
    { id: "50000", name: "$50,000" },
    { id: "100000", name: "$100,000" },
    { id: "200000", name: "$200,000" },
  ];

  const experienceLevels = [
    { id: "beginner", name: "Beginner (0-1 years)" },
    { id: "intermediate", name: "Intermediate (1-3 years)" },
    { id: "advanced", name: "Advanced (3+ years)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Your Trading Identity</h3>
        <p className="text-sm text-muted-foreground">
          Set up your trading account details and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="My Trading Account" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="broker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broker</FormLabel>
              <FormControl>
                <Input placeholder="Your Broker" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="accountCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Account Size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountSizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch("intent")?.includes("propFirmChallenge") && (
          <FormField
            control={form.control}
            name="propFirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prop Firm</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Prop Firm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propFirms.map((firm) => (
                      <SelectItem key={firm.id} value={firm.id}>
                        {firm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Experience Level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
