import React from "react";

import { Button } from "@/app/_shared/components/ui/button";
import { Input } from "@/app/_shared/components/ui/input";
import { Label } from "@/app/_shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_shared/components/ui/select";
import { Textarea } from "@/app/_shared/components/ui/textarea";
import { cn } from "@/app/_shared/lib/utils";

import MultipleSelector, { Option } from "../../ui/multiple-selector";

export function FormLayout({
  children,
  onSubmit,
  className,
  isDisabled,
}: {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  isDisabled?: boolean; // Optional loading state
  className?: string;
}) {
  return (
    <form
      className={cn(className, "flex flex-col gap-4")}
      onSubmit={async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isDisabled) await onSubmit(e);
      }}
    >
      {children}
    </form>
  );
}

export function FormInput({
  formName,
  placeholder,
  value,
  onChange,
  isDisabled,
  isRequired = true,
  label,
  description,
  className,
  type = "text",
  multiple = false,
  accept,
}: {
  multiple?: boolean; // Optional multiple file selection
  type?: "text" | "password" | "email" | "number" | "file";
  label?: string;
  description?: string; // Optional description below the label
  formName: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean; // Optional loading state
  isRequired?: boolean; // Optional required state
  className?: string; // Custom class for input styling
  accept?: string; // Optional file type for file input
}) {
  return (
    <div className={className}>
      {label && (
        <Label className="my-2 block" htmlFor={formName}>
          {label}
        </Label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <Input
        accept={accept}
        multiple={multiple}
        type={type}
        required={isRequired}
        name={formName}
        id={formName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={isDisabled} // Disable input when loading
        aria-label={label}
      />
    </div>
  );
}

export function FormTextarea({
  formName,
  placeholder,
  value,
  onChange,
  isDisabled,
  isRequired = true,
  label,
  description,
  className,
}: {
  label?: string;
  description?: string;
  formName: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isDisabled?: boolean; // Optional loading state
  isRequired?: boolean; // Optional required state
  className?: string; // Custom class for textarea styling
}) {
  return (
    <div className={className}>
      {label && (
        <Label className="my-2 block" htmlFor={formName}>
          {label}
        </Label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <Textarea
        required={isRequired}
        name={formName}
        id={formName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={isDisabled} // Disable textarea when loading
        aria-label={label}
      />
    </div>
  );
}

export function FormSelect({
  formName,
  value,
  options,
  label,
  onValueChange,
  isDisabled,
  isRequired = true,
  action,
  description,
  className,
}: {
  action?: React.ReactNode; // Optional action (like a button) next to the select
  formName: string;
  value: string | undefined;
  onValueChange: (val: string) => void;
  options: {
    value: string;
    label?: string;
  }[];
  label?: string;
  isDisabled?: boolean; // Optional loading state
  isRequired?: boolean; // Optional required state
  description?: string; // Optional description below the label
  className?: string; // Custom class for select styling
}) {
  return (
    <div className={className}>
      {label && (
        <Label className="my-2 block" htmlFor={formName}>
          {label}
        </Label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {action ? (
        <div className="grid grid-cols-8 gap-1">
          <Select
            required={isRequired}
            name={formName}
            onValueChange={onValueChange}
            value={value}
            defaultValue={value}
            disabled={isDisabled} // Disable select when loading
          >
            <SelectTrigger className="col-span-6">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="col-span-2">{action}</div>
        </div>
      ) : (
        <Select
          required={isRequired}
          name={formName}
          onValueChange={onValueChange}
          value={value}
          defaultValue={value}
          disabled={isDisabled} // Disable select when loading
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export function FormSubmitButton({
  text = "Confirm",
  isDisabled,
  isLoading,
  className,
}: {
  text?: string;
  isDisabled?: boolean;
  isLoading?: boolean; // Optional loading state with spinner
  className?: string; // Custom class for button styling
}) {
  return (
    <Button
      className={cn("w-full", className)}
      type="submit"
      disabled={isDisabled || isLoading}
      isLoading={isLoading}
    >
      {text}
    </Button>
  );
}

export function FormMultiSelect({
  formName,
  value,
  options,
  label,
  onValueChange,
  isDisabled,
  placeholder,
  action,
  description,
  className,
}: {
  action?: React.ReactNode;
  formName: string;
  value: Option[];
  onValueChange: (val: Option[]) => void;
  options: {
    value: string;
    label: string;
  }[];
  placeholder: string;
  label?: string;
  isDisabled?: boolean; // Optional loading state
  isRequired?: boolean; // Optional required state
  description?: string; // Optional description below the label
  className?: string; // Custom class for multi-select styling
}) {
  return (
    <div className={className}>
      {label && (
        <Label className="my-2 block" htmlFor={formName}>
          {label}
        </Label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {action ? (
        <div className="grid grid-cols-8 gap-1">
          <div className="col-span-6 bg-background">
            {/* <MultiSelect
              className="w-full"
              disabled={isDisabled || false}
              name={formName}
              options={options}
              onValueChange={onValueChange}
              defaultValue={value}
              value={value}
              placeholder={placeholder}
              variant="inverted"
              maxCount={maxCount}
            /> */}
            <MultipleSelector
              value={value}
              onChange={onValueChange}
              disabled={isDisabled || false}
              options={options}
              placeholder={placeholder}
            />
          </div>
          <div className="col-span-2">{action}</div>
        </div>
      ) : (
        <MultipleSelector
          value={value}
          onChange={onValueChange}
          disabled={isDisabled || false}
          options={options}
          placeholder={placeholder}
        />
        // <MultiSelect
        //   className="w-full bg-background"
        //   disabled={isDisabled || false}
        //   name={formName}
        //   options={options}
        //   onValueChange={onValueChange}
        //   defaultValue={value}
        //   value={value}
        //   placeholder={placeholder}
        //   variant="inverted"
        //   maxCount={maxCount}
        // />
      )}
    </div>
  );
}
