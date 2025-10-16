"use client";
import React, { useEffect } from "react";
import { CustomerOrderSummary } from "@/types";
import { useToast } from "@/context/ToastContext";

interface TopCustomersProps {
  customers: CustomerOrderSummary[];
  loading: boolean;
  error: string | null;
}

export default function TopCustomers({
  customers,
  loading,
  error,
}: TopCustomersProps) {
  const { showError } = useToast();

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      showError(`Failed to load top customers: ${error}`);
    }
  }, [error, showError]);

  return (
    <div className="bg-indigo-600 rounded-2xl shadow-2xl card-responsive mb-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Top Customers
        </h2>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-white"></div>
          <p className="mt-4 text-white/90 text-sm sm:text-base">
            Loading top customers...
          </p>
        </div>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">
                      {customer.customerName}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 break-all">
                      {customer.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-xs sm:text-sm">
                    Orders:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {customer.orderCount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-xs sm:text-sm">
                    Total Spent:
                  </span>
                  <span className="text-lg sm:text-xl font-semibold">
                    ${customer.totalSpent.toFixed(2)}
                  </span>
                </div>

                {customer.lastOrderDate && (
                  <div className="pt-3 border-t border-white/20">
                    <p className="text-xs text-white/70">
                      Last order:{" "}
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <div className="text-center py-8 text-white/80 text-sm sm:text-base">
          No customer data available
        </div>
      )}
    </div>
  );
}
