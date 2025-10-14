"use client";

import { useForm } from "react-hook-form";
import { useFormPersistence } from "@/hooks/useFormPersistence";

export interface ProductFormData {
  productName: string;
  supplier: string;
  category: string;
  quantityPerUnit: string;
  unitPrice: number;
  units: string;
}

interface ProductFormProps {
  suppliers: string[];
  categories: string[];
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  storageKey?: string;
  productId?: number; // If editing, show Product ID
}

export default function ProductForm({
  suppliers,
  categories,
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  storageKey,
  productId,
}: ProductFormProps) {
  const getDefaultFormValues = (): ProductFormData => ({
    productName: "",
    supplier: "",
    category: "",
    quantityPerUnit: "",
    unitPrice: 0,
    units: "",
    ...defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<ProductFormData>({
    defaultValues: getDefaultFormValues(),
    mode: "onBlur",
  });

  // Form persistence (only if storageKey provided)
  const { clearSavedData } = storageKey
    ? useFormPersistence(storageKey, watch)
    : { clearSavedData: () => {} };

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Product ID (Read-only if editing) */}
      {productId !== undefined && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product ID
          </label>
          <input
            type="text"
            value={`#${productId}`}
            disabled
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Product ID cannot be changed
          </p>
        </div>
      )}

      {/* Product Name */}
      <div>
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("productName", {
            required: "Product name is required",
            minLength: {
              value: 2,
              message: "Product name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Product name must not exceed 100 characters",
            },
          })}
          type="text"
          id="productName"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
            errors.productName
              ? "border-red-500 dark:border-red-400 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          }`}
          placeholder="Enter product name"
        />
        {errors.productName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.productName.message}
          </p>
        )}
      </div>

      {/* Category (Dropdown) */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          {...register("category", {
            required: "Category is required",
          })}
          id="category"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
            errors.category
              ? "border-red-500 dark:border-red-400 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          }`}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Supplier (Dropdown) */}
      <div>
        <label
          htmlFor="supplier"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Supplier <span className="text-red-500">*</span>
        </label>
        <select
          {...register("supplier", {
            required: "Supplier is required",
          })}
          id="supplier"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
            errors.supplier
              ? "border-red-500 dark:border-red-400 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          }`}
        >
          <option value="">Select a supplier</option>
          {suppliers.map((sup) => (
            <option key={sup} value={sup}>
              {sup}
            </option>
          ))}
        </select>
        {errors.supplier && (
          <p className="mt-1 text-sm text-red-600">{errors.supplier.message}</p>
        )}
      </div>

      {/* Quantity Per Unit */}
      <div>
        <label
          htmlFor="quantityPerUnit"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Quantity Per Unit <span className="text-red-500">*</span>
        </label>
        <input
          {...register("quantityPerUnit", {
            required: "Quantity per unit is required",
            minLength: {
              value: 1,
              message: "Quantity per unit is required",
            },
          })}
          type="text"
          id="quantityPerUnit"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
            errors.quantityPerUnit
              ? "border-red-500 dark:border-red-400 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          }`}
          placeholder="e.g., 1kg, 10 pieces, 500ml"
        />
        {errors.quantityPerUnit && (
          <p className="mt-1 text-sm text-red-600">
            {errors.quantityPerUnit.message}
          </p>
        )}
      </div>

      {/* Unit Price */}
      <div>
        <label
          htmlFor="unitPrice"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Unit Price <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            $
          </span>
          <input
            {...register("unitPrice", {
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
            })}
            type="number"
            step="0.01"
            id="unitPrice"
            className={`w-full pl-8 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
              errors.unitPrice
                ? "border-red-500 dark:border-red-400 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.unitPrice && (
          <p className="mt-1 text-sm text-red-600">
            {errors.unitPrice.message}
          </p>
        )}
      </div>

      {/* Units in Stock */}
      <div>
        <label
          htmlFor="units"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Units in Stock <span className="text-red-500">*</span>
        </label>
        <input
          {...register("units", {
            required: "Units in stock is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Units must be a whole number",
            },
            min: {
              value: 0,
              message: "Units cannot be negative",
            },
          })}
          type="text"
          id="units"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
            errors.units
              ? "border-red-500 dark:border-red-400 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          }`}
          placeholder="Enter number of units"
        />
        {errors.units && (
          <p className="mt-1 text-sm text-red-600">{errors.units.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || (productId !== undefined && !isDirty)}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {productId !== undefined ? "Updating..." : "Creating..."}
            </span>
          ) : (
            submitButtonText
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            if (storageKey) clearSavedData();
          }}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          {productId !== undefined ? "Reset Changes" : "Clear Form"}
        </button>
      </div>

      {/* Form Persistence Info */}
      {storageKey && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💾 Your form progress is automatically saved locally
          </p>
        </div>
      )}
    </form>
  );
}
