/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton, Select, TextField } from "@radix-ui/themes";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { IconType } from "react-icons";
import React, { forwardRef } from "react";

interface FormInputProps {
  type: string | any;
  id: string;
  name: string;
  label?: string;
  placeholder: string;
  register: UseFormRegister<any>;
  Icon?: IconType;
  errors: FieldErrors;
  isVisible?: boolean;
  setIsVisible?: (isVisible: boolean) => void;
  validate?: (value: string) => boolean | string | undefined;
  defaultValue?: string | undefined | object;
  isRequired?: boolean;
  disabled?: boolean;
}

interface FormSelectProps {
  id: string;
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder: string;
  data: Array<{ _id: string; name: string }>;
  register: UseFormRegister<any>;
  setValue?: (name: string, value: string) => void;
  errors: FieldErrors;
  validate?: (value: string) => boolean | string | undefined;
  control: Control<FieldValues>;
  disabled?: boolean;
  isRequired: boolean;
}

export const FormInput = ({
  type,
  id,
  name,
  label,
  placeholder,
  register,
  Icon,
  errors,
  isVisible,
  setIsVisible,
  validate,
  defaultValue,
  isRequired,
  disabled,
  ...rest
}: FormInputProps) => {
  const toggleVisibility = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (
      event.type === "click" ||
      (event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Enter")
    ) {
      event.preventDefault();
      setIsVisible?.(!isVisible);
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-2" {...rest}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label} {isRequired && <span className="text-red-600">*</span>}
      </label>
      <TextField.Root
        size="2"
        type={isVisible ? "text" : type}
        id={id}
        {...register(name, { validate })}
        placeholder={placeholder}
        defaultValue={defaultValue as string}
        disabled={disabled}
      >
        {Icon && (
          <TextField.Slot>
            <Icon size="1rem" />
          </TextField.Slot>
        )}
        {type === "password" && (
          <TextField.Slot>
            <IconButton size="1" variant="ghost" onClick={toggleVisibility}>
              {isVisible ? (
                <FaRegEyeSlash size="1rem" />
              ) : (
                <FaRegEye size="1rem" />
              )}
            </IconButton>
          </TextField.Slot>
        )}
      </TextField.Root>
      {errors[name] && (
        <span className="text-xs text-red-600">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      id,
      data,
      name,
      errors,
      placeholder,
      validate,
      defaultValue,
      control,
      disabled,
      isRequired,
    },
    ref
  ) => {
    return (
      <div className="mb-4 flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
          {isRequired && <span className="text-red-600">*</span>}
        </label>
        <Controller
          name={name}
          control={control}
          rules={validate ? { validate } : undefined}
          render={({ field }) => (
            <Select.Root
              onValueChange={field.onChange}
              size="2"
              defaultValue={defaultValue || ""}
              disabled={disabled}
            >
              <Select.Trigger
                placeholder={placeholder}
                id={id}
                ref={ref as React.Ref<HTMLButtonElement>}
              />
              <Select.Content>
                {data?.map((item) => (
                  <Select.Item
                    key={item._id}
                    value={item.name}
                    className="text-black"
                  >
                    {item.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
        />
        {errors[name] && (
          <span className="text-xs text-red-600">
            {errors[name]?.message as string}
          </span>
        )}
      </div>
    );
  }
);
