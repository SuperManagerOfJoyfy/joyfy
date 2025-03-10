import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { clsx } from "clsx";

import s from "./RadioGroup.module.scss";

const RadioGroupRoot = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={clsx(s.root, className)}
      {...props}
      ref={ref}
    />
  );
});

RadioGroupRoot.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      className={clsx(s.option, className)}
      {...props}
      ref={ref}
    >
      <div className={s.icon} />
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

type Option = {
  label: string;
  value: string;
};

export type RadioGroupProps = {
  errorMessage?: string;
  options: Option[];
} & Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  "children"
>;

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>((props, ref) => {
  const { errorMessage, options, ...restProps } = props;

  return (
    <div className={s.container}>
      <RadioGroupRoot {...restProps} ref={ref}>
        {options.map((option) => (
          <label className={s.label} key={option.value}>
            <RadioGroupItem value={option.value} id={option.value} />
            <label htmlFor={option.value} className={s.labelText}>
              {option.label}
            </label>
          </label>
        ))}
      </RadioGroupRoot>
      {errorMessage && <div className={s.error}>{errorMessage}</div>}
    </div>
  );
});

RadioGroup.displayName = "RadioGroup";

export { RadioGroup, RadioGroupItem, RadioGroupRoot };
