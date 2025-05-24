"use client";

import { useState } from "react";
import { Check, ChevronDownIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LogTrade } from "./log-forms";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";

export function AccountSelection() {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [showTradeForm, setShowTradeForm] = useState(false);

  const { user } = useAuth();

  // Use user's accounts if available, otherwise fallback to hardcoded accounts
  const availableAccounts = user?.accounts?.length ? user.accounts : [];

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts((current) =>
      current.includes(accountId)
        ? current.filter((id) => id !== accountId)
        : [...current, accountId]
    );
  };

  const handleContinue = () => {
    if (selectedAccounts.length > 0) {
      setShowTradeForm(true);
    }
  };

  const handleReset = () => {
    setSelectedAccounts([]);
    setShowTradeForm(false);
  };

  if (showTradeForm) {
    return (
      <>
        <LogTrade selectedAccountIds={selectedAccounts} />
      </>
    );
  }

  return (
    <div className="*:not-first:mt-2 px-4">
      <h3 className="leading-none font-semibold">
        Select From Trading Accounts
      </h3>
      <Label
        htmlFor="account"
        className="text-xs font-semibold text-muted-foreground"
      >
        Choose which accounts you want to log this trade for
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="account"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            {selectedAccounts.length > 0
              ? `${selectedAccounts.length} account${
                  selectedAccounts.length !== 1 ? "s" : ""
                } selected`
              : "Select accounts..."}
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Find organization" />
            <CommandList>
              <CommandEmpty>No account found.</CommandEmpty>
              {availableAccounts.map((account) => {
                const { id, accountName, accountSize, broker } = account;
                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={() => toggleAccount(id)}
                    className="py-2 w-full"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="text-sm">{accountName}</p>
                        <p className="text-xs text-muted-foreground">
                          {broker}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ${accountSize?.toLocaleString()}
                        </span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedAccounts.includes(id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </div>
                    </div>
                  </CommandItem>
                );
              })}

              <CommandSeparator />
              <CommandGroup>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <PlusIcon
                    size={16}
                    className="-ms-2 opacity-60"
                    aria-hidden="true"
                  />
                  New Account
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedAccounts.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedAccounts.map((id) => {
            const account = availableAccounts.find((a) => a.id === id);
            return (
              <Badge
                key={id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {account?.accountName}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => toggleAccount(id)}
                >
                  <span className="sr-only">Remove</span>
                  <span className="text-xs">✕</span>
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {selectedAccounts.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset
          </Button>
          <Button onClick={handleContinue} className="w-full">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
