"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import * as React from "react";
import {
  Button,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
} from "react-aria-components";

export interface NumberFieldProps
  extends Omit<AriaNumberFieldProps, "children"> {
  label?: React.ReactNode;
  name?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  placeholder?: string;
  className?: string;
}

export const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      label,
      name,
      value,
      defaultValue,
      onChange,
      minValue,
      maxValue,
      step,
      placeholder,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <AriaNumberField
        value={value}
        defaultValue={defaultValue}
        minValue={minValue ?? 0.01}
        maxValue={maxValue}
        step={step ?? 0.01}
        onChange={onChange}
        {...props}
      >
        <div className="*:not-first:mt-2">
          {label && (
            <Label className="text-foreground text-sm font-medium">
              {label}
            </Label>
          )}
          <Group className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-10 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 data-focus-within:ring-[3px]">
            <Button
              slot="decrement"
              className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MinusIcon size={16} aria-hidden="true" />
            </Button>
            <Input
              ref={ref}
              name={name}
              className={
                "bg-background text-foreground w-full grow px-3 py-2 text-center tabular-nums h-10 " +
                (className || "")
              }
              placeholder={placeholder}
            />
            <Button
              slot="increment"
              className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusIcon size={16} aria-hidden="true" />
            </Button>
          </Group>
        </div>
      </AriaNumberField>
    );
  }
);
NumberField.displayName = "NumberField";
