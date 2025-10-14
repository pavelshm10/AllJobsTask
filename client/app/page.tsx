"use client";

import TopCustomers from "@/components/TopCustomers";
import ProductsTable from "@/components/ProductsTable";
import { useTopCustomers } from "@/hooks/useTopCustomers";
import { useProducts } from "@/hooks/useProducts";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  // Use React Query hooks for data fetching
  const {
    data: topCustomers = [],
    isLoading: customersLoading,
    error: customersError,
    refetch: refetchCustomers,
  } = useTopCustomers(3);

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();
  return (
    <>
      <ThemeToggle />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Online Shop
            </h1>
          </div>
          <TopCustomers
            customers={topCustomers}
            loading={customersLoading}
            error={customersError?.message ?? null}
            onRefresh={() => refetchCustomers()}
          />
          <ProductsTable
            products={products}
            loading={productsLoading}
            error={productsError?.message ?? null}
            onRefresh={() => refetchProducts()}
          />
        </div>
      </main>
    </>
  );
}
