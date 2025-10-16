"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/hooks/useProducts";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { ProductForm, ProductFormData } from "@/components/Forms";
import {
  SuccessBanner,
  ErrorBanner,
  ConfirmDialog,
  ThemeToggle,
} from "@/components/UI";

const API_URL = "https://localhost:5001/api";

async function fetchProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/Products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string, 10);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<ProductFormData | null>(null);

  // Fetch the product to edit
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !isNaN(productId),
  });

  // Fetch existing products to get suppliers and categories
  const { data: existingProducts = [] } = useProducts();

  // Get unique suppliers and categories
  const suppliers = Array.from(
    new Set(existingProducts.map((p) => p.supplier))
  ).sort();
  const categories = Array.from(
    new Set(existingProducts.map((p) => p.category))
  ).sort();

  // Update product mutation
  const updateProductMutation = useUpdateProduct();

  // Handle form submission (show confirmation first)
  const handleSubmit = async (data: ProductFormData) => {
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  // Handle confirmed update
  const handleConfirmedUpdate = async () => {
    if (!pendingData) return;

    try {
      setShowConfirmDialog(false);
      setShowError(false);
      setShowSuccess(false);

      await updateProductMutation.mutateAsync({
        id: productId,
        data: {
          productName: pendingData.productName,
          category: pendingData.category,
          supplier: pendingData.supplier,
          unitPrice: pendingData.unitPrice,
          units: parseInt(pendingData.units, 10),
        },
      });

      // Success!
      setShowSuccess(true);
      setPendingData(null);

      // Auto-dismiss and redirect after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      setShowError(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while updating the product"
      );
      setPendingData(null);
    }
  };

  // Loading state
  if (productLoading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (productError || !product) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                Product Not Found
              </h2>
              <p className="mt-2 text-gray-600">
                The product you're trying to edit doesn't exist.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
            <h1 className="text-4xl font-bold text-gray-800">Edit Product</h1>
            <p className="text-gray-600 mt-2">
              Update product information. All fields are required.
            </p>
          </div>

          {/* Success Banner */}
          {showSuccess && (
            <SuccessBanner
              message="Product updated successfully! Redirecting to home... ✨"
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
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <ProductForm
              suppliers={suppliers}
              categories={categories}
              defaultValues={{
                productName: product.productName,
                supplier: product.supplier,
                category: product.category,
                quantityPerUnit: "1 unit", // Not stored in DB, default value
                unitPrice: product.unitPrice,
                units: product.units.toString(),
              }}
              onSubmit={handleSubmit}
              submitButtonText="Update Product"
              isSubmitting={updateProductMutation.isPending}
              productId={productId}
            />
          </div>

          {/* Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showConfirmDialog}
            title="Confirm Update"
            message="Are you sure you want to save these changes to the product?"
            onConfirm={handleConfirmedUpdate}
            onCancel={() => {
              setShowConfirmDialog(false);
              setPendingData(null);
            }}
            confirmText="Save Changes"
            cancelText="Cancel"
            confirmColor="green"
          />
        </div>
      </main>
    </>
  );
}
