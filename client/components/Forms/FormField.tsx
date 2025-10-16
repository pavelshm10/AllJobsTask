"use client";

import { UseFormRegister, FieldError } from "react-hook-form";
import { ProductFormData } from "./ProductForm";

interface FormFieldProps {
  label: string;
  name: keyof ProductFormData;
  type?: "text" | "number" | "select";
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  register: UseFormRegister<ProductFormData>;
  options?: { value: string; label: string }[];
  step?: string;
  prefix?: string;
  disabled?: boolean;
  value?: string | number;
}

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  error,
  register,
  options = [],
  step,
  prefix,
  disabled = false,
  value,
}: FormFieldProps) {
  const fieldStyles = `w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 text-sm sm:text-base ${
    error
      ? "border-red-500 dark:border-red-400 focus:ring-red-500"
      : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
  }`;

  const disabledStyles = disabled
    ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
    : "";

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          {...register(name)}
          className={`${fieldStyles} ${disabledStyles}`}
          disabled={disabled}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === "number" && prefix) {
      return (
        <div className="relative">
          <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            {prefix}
          </span>
          <input
            {...register(name)}
            type={type}
            step={step}
            placeholder={placeholder}
            className={`${fieldStyles} pl-7 sm:pl-8 pr-4 ${disabledStyles}`}
            disabled={disabled}
          />
        </div>
      );
    }

    return (
      <input
        {...register(name)}
        type={type}
        step={step}
        placeholder={placeholder}
        className={`${fieldStyles} ${disabledStyles}`}
        disabled={disabled}
        value={value}
      />
    );
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
