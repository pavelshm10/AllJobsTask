"use client";

import { useForm } from "react-hook-form";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import ProductFormFields from "./ProductFormFields";
import ProductFormActions from "./ProductFormActions";

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
  const persistenceHook = useFormPersistence(storageKey || "", watch);
  const { clearSavedData } = storageKey
    ? persistenceHook
    : { clearSavedData: () => {} };

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
  };

  const handleReset = () => {
    reset();
    if (storageKey) clearSavedData();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <ProductFormFields
        register={register}
        errors={errors}
        suppliers={suppliers}
        categories={categories}
        productId={productId}
      />

      <ProductFormActions
        isSubmitting={isSubmitting}
        productId={productId}
        isDirty={isDirty}
        submitButtonText={submitButtonText}
        onReset={handleReset}
        storageKey={storageKey}
      />
    </form>
  );
}
