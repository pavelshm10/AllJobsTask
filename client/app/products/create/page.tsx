"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { ProductForm, ProductFormData } from "@/components/Forms";
import { SuccessBanner, ErrorBanner, ThemeToggle } from "@/components/UI";

const FORM_STORAGE_KEY = "createProductForm";

export default function CreateProductPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch existing products to get suppliers and categories
  const { data: existingProducts = [] } = useProducts();

  // Get unique suppliers and categories
  const suppliers = Array.from(
    new Set(existingProducts.map((p) => p.supplier))
  ).sort();
  const categories = Array.from(
    new Set(existingProducts.map((p) => p.category))
  ).sort();

  // Create product mutation
  const createProductMutation = useCreateProduct();

  // Handle form submission
  const handleSubmit = async (data: ProductFormData) => {
    try {
      setShowError(false);
      setShowSuccess(false);

      await createProductMutation.mutateAsync({
        productName: data.productName,
        category: data.category,
        supplier: data.supplier,
        unitPrice: data.unitPrice,
        units: parseInt(data.units, 10),
      });

      // Success!
      setShowSuccess(true);

      // Auto-dismiss success banner after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setShowError(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the product"
      );
    }
  };

  return (
    <>
      <ThemeToggle />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              Create New Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Add a new product to the inventory. All fields are required.
            </p>
          </div>

          {/* Success Banner */}
          {showSuccess && (
            <SuccessBanner
              message="Product created successfully! ✨"
              onDismiss={() => setShowSuccess(false)}
            />
          )}

          {/* Error Banner */}
          {showError && (
            <ErrorBanner
              message={errorMessage}
              onDismiss={() => setShowError(false)}
            />
          )}

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
            <ProductForm
              suppliers={suppliers}
              categories={categories}
              onSubmit={handleSubmit}
              submitButtonText="Create Product"
              isSubmitting={createProductMutation.isPending}
              storageKey={FORM_STORAGE_KEY}
            />
          </div>
        </div>
      </main>
    </>
  );
}
