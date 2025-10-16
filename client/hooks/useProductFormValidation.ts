import { useForm } from "react-hook-form";
import { ProductFormData } from "./ProductForm";

export function useProductFormValidation() {
  const getFieldValidation = () => ({
    productName: {
      required: "Product name is required",
      minLength: {
        value: 2,
        message: "Product name must be at least 2 characters",
      },
      maxLength: {
        value: 100,
        message: "Product name must not exceed 100 characters",
      },
    },
    category: {
      required: "Category is required",
    },
    supplier: {
      required: "Supplier is required",
    },
    quantityPerUnit: {
      required: "Quantity per unit is required",
      minLength: {
        value: 1,
        message: "Quantity per unit is required",
      },
    },
    unitPrice: {
      required: "Unit price is required",
      min: {
        value: 0.01,
        message: "Unit price must be at least $0.01",
      },
      max: {
        value: 999999.99,
        message: "Unit price must not exceed $999,999.99",
      },
      valueAsNumber: true,
    },
    units: {
      required: "Units in stock is required",
      pattern: {
        value: /^[0-9]+$/,
        message: "Units must be a whole number",
      },
      min: {
        value: 0,
        message: "Units cannot be negative",
      },
    },
  });

  const getFieldStyles = (hasError: boolean) => ({
    base: "w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2",
    error: "border-red-500 dark:border-red-400 focus:ring-red-500",
    normal:
      "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400",
    get className() {
      return `${this.base} ${hasError ? this.error : this.normal}`;
    },
  });

  return {
    getFieldValidation,
    getFieldStyles,
  };
}
