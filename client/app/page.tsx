"use client";

import { TopCustomers } from "@/components";
import { ProductsTable } from "@/components/Products";
import { ThemeToggle } from "@/components/UI";
import { useTopCustomers } from "@/hooks/useTopCustomers";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  // Use React Query hooks for data fetching
  const {
    data: topCustomers = [],
    isLoading: customersLoading,
    error: customersError,
    // refetch: refetchCustomers,
  } = useTopCustomers(3);

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
    // refetch: refetchProducts,
  } = useProducts();
  return (
    <>
      <ThemeToggle />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="container-responsive">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="heading-responsive font-bold text-gray-800 dark:text-gray-100 mb-4">
              Online Shop
            </h1>
          </div>
          <TopCustomers
            customers={topCustomers}
            loading={customersLoading}
            error={customersError?.message ?? null}
          />
          <ProductsTable
            products={products}
            loading={productsLoading}
            error={productsError?.message ?? null}
          />
        </div>
      </main>
    </>
  );
}
