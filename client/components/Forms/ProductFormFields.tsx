"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormData } from "./ProductForm";
import FormField from "./FormField";

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  suppliers: string[];
  categories: string[];
  productId?: number;
}

export default function ProductFormFields({
  register,
  errors,
  suppliers,
  categories,
  productId,
}: ProductFormFieldsProps) {
  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier,
    label: supplier,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  return (
    <div className="form-responsive">
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
      <FormField
        label="Product Name"
        name="productName"
        type="text"
        placeholder="Enter product name"
        required
        error={errors.productName}
        register={register}
      />

      {/* Category */}
      <FormField
        label="Category"
        name="category"
        type="select"
        required
        error={errors.category}
        register={register}
        options={categoryOptions}
      />

      {/* Supplier */}
      <FormField
        label="Supplier"
        name="supplier"
        type="select"
        required
        error={errors.supplier}
        register={register}
        options={supplierOptions}
      />

      {/* Quantity Per Unit */}
      <FormField
        label="Quantity Per Unit"
        name="quantityPerUnit"
        type="text"
        placeholder="e.g., 1kg, 10 pieces, 500ml"
        required
        error={errors.quantityPerUnit}
        register={register}
      />

      {/* Unit Price */}
      <FormField
        label="Unit Price"
        name="unitPrice"
        type="number"
        placeholder="0.00"
        step="0.01"
        prefix="$"
        required
        error={errors.unitPrice}
        register={register}
      />

      {/* Units in Stock */}
      <FormField
        label="Units in Stock"
        name="units"
        type="text"
        placeholder="Enter number of units"
        required
        error={errors.units}
        register={register}
      />
    </div>
  );
}
